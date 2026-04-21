"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { AuthUser, FeedbackEntry, FeedbackStatus, UserRole } from "@/lib/types";

const statuses: FeedbackStatus[] = ["new", "reviewing", "resolved"];

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusTone(status: FeedbackStatus) {
  if (status === "new") return "hot" as const;
  if (status === "reviewing") return "world" as const;
  return "lv" as const;
}

export function AdminPanel({
  initialFeedback,
  initialUsers,
  currentUser,
}: {
  initialFeedback: FeedbackEntry[];
  initialUsers: AuthUser[];
  currentUser: AuthUser;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [users, setUsers] = useState(initialUsers);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(initialFeedback.map((entry) => [entry.id, entry.adminNote ?? ""])),
  );
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      { label: "New feedback", value: feedback.filter((entry) => entry.status === "new").length },
      { label: "In review", value: feedback.filter((entry) => entry.status === "reviewing").length },
      { label: "Resolved", value: feedback.filter((entry) => entry.status === "resolved").length },
      { label: "Users", value: users.length },
    ],
    [feedback, users],
  );

  async function updateFeedbackItem(id: string, status: FeedbackStatus) {
    setError("");
    const response = await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        adminNote: notes[id],
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Could not update feedback.");
      return;
    }

    setFeedback((items) => items.map((item) => (item.id === id ? payload.feedback : item)));
  }

  async function deleteFeedbackItem(id: string) {
    setError("");
    const response = await fetch(`/api/admin/feedback/${id}`, {
      method: "DELETE",
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Could not delete feedback.");
      return;
    }

    setFeedback((items) => items.filter((item) => item.id !== id));
  }

  async function updateRole(userId: string, role: UserRole) {
    setError("");
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Could not update user.");
      return;
    }

    setUsers((items) => items.map((item) => (item.id === userId ? payload.user : item)));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(145deg,rgba(248,113,113,0.18),rgba(12,16,22,0.94)_38%,rgba(56,189,248,0.1)_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="hot">Admin</Badge>
              <Badge tone="world">{currentUser.email}</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              RaceHub admin panel
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
              Review visitor feedback, track ideas, resolve reports, and manage registered user access.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">{stat.label}</div>
            <div className="mt-3 text-4xl font-black tracking-tight text-white">{stat.value}</div>
          </div>
        ))}
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Feedback inbox</h2>
            <p className="mt-1 text-sm text-white/58">Messages submitted from the public feedback form.</p>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-white/60">
            No feedback yet. When visitors send ideas, they will appear here.
          </div>
        ) : (
          <div className="grid gap-4">
            {feedback.map((entry) => (
              <article key={entry.id} className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={statusTone(entry.status)}>{entry.status}</Badge>
                      <Badge tone="neutral">{entry.topic}</Badge>
                      <Badge tone="world">{formatDateTime(entry.createdAt)}</Badge>
                    </div>
                    <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                      {entry.name || "Anonymous visitor"}
                    </h3>
                    {entry.email ? <p className="mt-1 text-sm text-white/58">{entry.email}</p> : null}
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/74">{entry.message}</p>
                  </div>

                  <div className="w-full shrink-0 space-y-3 xl:w-80">
                    <textarea
                      className="min-h-24 w-full rounded-2xl border border-white/10 bg-[#0b1016] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-orange-400/50"
                      placeholder="Admin note or reply idea"
                      value={notes[entry.id] ?? ""}
                      onChange={(event) => setNotes((value) => ({ ...value, [entry.id]: event.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateFeedbackItem(entry.id, status)}
                          className={`rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                            entry.status === status
                              ? "border-orange-400/35 bg-orange-500/16 text-white"
                              : "border-white/10 bg-[#0b1016] text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => deleteFeedbackItem(entry.id)}
                        className="rounded-2xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-100 transition hover:bg-red-500/16"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Registered users</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <article key={user.id} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={user.role === "admin" ? "hot" : "neutral"}>{user.role}</Badge>
                {user.id === currentUser.id ? <Badge tone="world">You</Badge> : null}
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-white">{user.name}</h3>
              <p className="mt-1 text-sm text-white/58">{user.email}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
                Joined {formatDateTime(user.createdAt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={user.role === "admin"}
                  onClick={() => updateRole(user.id, "admin")}
                  className="rounded-2xl border border-orange-400/25 bg-orange-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange-100 transition hover:bg-orange-500/16 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Make admin
                </button>
                <button
                  type="button"
                  disabled={user.role === "user" || user.id === currentUser.id}
                  onClick={() => updateRole(user.id, "user")}
                  className="rounded-2xl border border-white/10 bg-[#0b1016] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Make user
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
