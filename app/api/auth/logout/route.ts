import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/serverStore";

export const runtime = "nodejs";

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ ok: true });
}
