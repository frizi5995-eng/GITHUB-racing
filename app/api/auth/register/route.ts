import { NextResponse } from "next/server";
import { registerUser, setUserSession } from "@/lib/serverStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
      adminCode: body.adminCode,
    });

    await setUserSession(user);
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not create account." },
      { status: 400 },
    );
  }
}
