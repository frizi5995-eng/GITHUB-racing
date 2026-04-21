import { NextResponse } from "next/server";
import { authenticateUser, setUserSession } from "@/lib/serverStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await authenticateUser(body.email, body.password);

    await setUserSession(user);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not sign in." },
      { status: 401 },
    );
  }
}
