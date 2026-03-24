import { getF1Races } from "@/lib/f1";

export async function GET() {
  const races = await getF1Races();

  return Response.json({ races });
}
