"use client";

import { useEffect } from "react";
import { pushRecentItem, RecentKind } from "@/lib/clientStorage";

export function RecentViewTracker({
  kind,
  itemId,
}: {
  kind: RecentKind;
  itemId: string;
}) {
  useEffect(() => {
    pushRecentItem(kind, itemId);
  }, [itemId, kind]);

  return null;
}
