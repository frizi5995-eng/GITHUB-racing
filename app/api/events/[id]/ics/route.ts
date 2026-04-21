import { NextResponse } from "next/server";
import { getRaceById } from "@/lib/races";
import { createEventIcs } from "@/lib/utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const race = await getRaceById(id);

  if (!race) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(createEventIcs(race), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${race.id}.ics"`,
    },
  });
}
