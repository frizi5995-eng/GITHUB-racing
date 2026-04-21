import React from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightedText({
  text,
  query,
}: {
  text: string;
  query?: string;
}) {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return <>{text}</>;
  }

  const parts = normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp);

  if (parts.length === 0) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${parts.join("|")})`, "gi");
  const segments = text.split(regex);

  return (
    <>
      {segments.map((segment, index) =>
        parts.some((part) => new RegExp(`^${part}$`, "i").test(segment)) ? (
          <mark key={`${segment}-${index}`} className="rounded bg-orange-500/20 px-0.5 text-orange-100">
            {segment}
          </mark>
        ) : (
          <React.Fragment key={`${segment}-${index}`}>{segment}</React.Fragment>
        ),
      )}
    </>
  );
}
