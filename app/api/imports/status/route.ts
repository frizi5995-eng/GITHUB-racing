import { getImportStatus } from "@/lib/importSources";

export function GET() {
  return Response.json(getImportStatus());
}
