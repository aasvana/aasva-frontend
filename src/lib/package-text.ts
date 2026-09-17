const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[\da-f]+|[a-z][\da-z]+);/gi, (entity, reference: string) => {
    const normalized = reference.toLowerCase();
    if (normalized.startsWith("#x")) return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
    if (normalized.startsWith("#")) return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
    return HTML_ENTITIES[normalized] ?? entity;
  });

export const cleanPackageText = (value: string) => {
  const withLineBreaks = value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|ul|ol|section|article|h[1-6])[^>]*>/gi, "\n");
  const withoutTags = withLineBreaks.replace(/<[^>]*>/g, "");
  const decoded = decodeHtmlEntities(withoutTags);
  const withoutContactDetails = decoded
    .replace(/\bhttps?:\/\/[^\s<>"']+/gi, "")
    .replace(/\bwww\.[^\s<>"']+/gi, "")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "");
  const lines = withoutContactDetails
    .replace(/[^\p{L}\p{N}\s.,:;!?\"'()[\]-]/gu, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim());
  const result: string[] = [];
  for (const line of lines) {
    if (line === "" && result[result.length - 1] === "") continue;
    result.push(line);
  }
  return result.join("\n").trim();
};
