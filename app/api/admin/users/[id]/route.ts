import { NextResponse } from "next/server";
import { requireAdmin, updateUserRole } from "@/lib/serverStore";
import { UserRole } from "@/lib/types";

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
    const role = body.role as UserRole;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ ok: false, error: "Invalid role." }, { status: 400 });
    }

    if (id === admin.id && role !== "admin") {
      return NextResponse.json({ ok: false, error: "You cannot remove your own admin role." }, { status: 400 });
    }

    const user = await updateUserRole(id, role);
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not update user." },
      { status: 400 },
    );
  }
}
