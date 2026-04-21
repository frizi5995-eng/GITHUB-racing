import { NextResponse } from "next/server";
import { deleteFeedback, requireAdmin, updateFeedback } from "@/lib/serverStore";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const feedback = await updateFeedback(id, {
      status: body.status,
      adminNote: body.adminNote,
    });

    return NextResponse.json({ ok: true, feedback });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not update feedback." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    await deleteFeedback(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not delete feedback." },
      { status: 400 },
    );
  }
}
