import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/serverStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedback = await createFeedback({
      name: body.name,
      email: body.email,
      topic: body.topic,
      message: body.message,
    });

    return NextResponse.json({ ok: true, feedback }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not send feedback." },
      { status: 400 },
    );
  }
}
