import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { AuthUser, FeedbackEntry, FeedbackStatus, UserRole } from "./types";

type StoredUser = AuthUser & {
  passwordHash: string;
  salt: string;
};

type SessionPayload = {
  sub: string;
  exp: number;
};

const DATA_DIR = path.join(process.cwd(), ".racehub-data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const SESSION_COOKIE = "racehub_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const SESSION_SECRET = process.env.RACEHUB_SESSION_SECRET ?? "racehub-local-dev-secret-change-me";

function publicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const value = await fs.readFile(filePath, "utf8");
    return JSON.parse(value) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readUsers() {
  return readJsonFile<StoredUser[]>(USERS_FILE, []);
}

async function writeUsers(users: StoredUser[]) {
  await writeJsonFile(USERS_FILE, users);
}

async function readFeedback() {
  return readJsonFile<FeedbackEntry[]>(FEEDBACK_FILE, []);
}

async function writeFeedback(feedback: FeedbackEntry[]) {
  await writeJsonFile(FEEDBACK_FILE, feedback);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 160000, 64, "sha512").toString("hex");
  return { salt, passwordHash };
}

function verifyPassword(password: string, user: StoredUser) {
  const { passwordHash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(passwordHash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function sign(value: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    sub: userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function readSessionToken(token?: string) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.sub || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  adminCode?: string;
}) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < 2) throw new Error("Please enter a name with at least 2 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const users = await readUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const now = new Date().toISOString();
  const { salt, passwordHash } = hashPassword(password);
  const adminCode = process.env.RACEHUB_ADMIN_CODE;
  const role: UserRole = users.length === 0 || (adminCode && input.adminCode === adminCode) ? "admin" : "user";
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    role,
    createdAt: now,
    salt,
    passwordHash,
  };

  await writeUsers([...users, user]);
  return publicUser(user);
}

export async function authenticateUser(emailInput: string, password: string) {
  const email = normalizeEmail(emailInput);
  const users = await readUsers();
  const user = users.find((item) => item.email === email);

  if (!user || !verifyPassword(password, user)) {
    throw new Error("Email or password is incorrect.");
  }

  return publicUser(user);
}

export async function setUserSession(user: AuthUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const payload = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!payload) return null;

  const users = await readUsers();
  const user = users.find((item) => item.id === payload.sub);
  return user ? publicUser(user) : null;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function listUsers() {
  const users = await readUsers();
  return users.map(publicUser).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function updateUserRole(userId: string, role: UserRole) {
  const users = await readUsers();
  const nextUsers = users.map((user) => (user.id === userId ? { ...user, role } : user));
  await writeUsers(nextUsers);
  const user = nextUsers.find((item) => item.id === userId);
  return user ? publicUser(user) : undefined;
}

export async function createFeedback(input: {
  name?: string;
  email?: string;
  topic: string;
  message: string;
}) {
  const topic = input.topic.trim();
  const message = input.message.trim();
  const name = input.name?.trim();
  const email = input.email ? normalizeEmail(input.email) : undefined;

  if (topic.length < 2) throw new Error("Please choose a feedback type.");
  if (message.length < 8) throw new Error("Please write a little more detail before sending.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");

  const now = new Date().toISOString();
  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    name: name || undefined,
    email,
    topic,
    message,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  const feedback = await readFeedback();
  await writeFeedback([entry, ...feedback]);
  return entry;
}

export async function listFeedback() {
  const feedback = await readFeedback();
  return feedback.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateFeedback(
  feedbackId: string,
  input: {
    status?: FeedbackStatus;
    adminNote?: string;
  },
) {
  const allowedStatuses: FeedbackStatus[] = ["new", "reviewing", "resolved"];
  const feedback = await readFeedback();
  let updated: FeedbackEntry | undefined;

  const nextFeedback = feedback.map((entry) => {
    if (entry.id !== feedbackId) return entry;

    updated = {
      ...entry,
      status: input.status && allowedStatuses.includes(input.status) ? input.status : entry.status,
      adminNote: input.adminNote?.trim() || entry.adminNote,
      updatedAt: new Date().toISOString(),
    };

    return updated;
  });

  if (!updated) throw new Error("Feedback item not found.");
  await writeFeedback(nextFeedback);
  return updated;
}

export async function deleteFeedback(feedbackId: string) {
  const feedback = await readFeedback();
  const nextFeedback = feedback.filter((entry) => entry.id !== feedbackId);

  if (nextFeedback.length === feedback.length) {
    throw new Error("Feedback item not found.");
  }

  await writeFeedback(nextFeedback);
}
