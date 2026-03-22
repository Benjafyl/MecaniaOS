const ACCEPTANCE_HEADERS = [
  "acceptance criteria",
  "criterios de aceptacion",
  "criterios de aceptación",
];

function isHeader(line: string) {
  const normalized = line
    .toLowerCase()
    .replace(/[:#*\-]/g, "")
    .trim();

  return ACCEPTANCE_HEADERS.includes(normalized);
}

export function extractAcceptanceCriteria(description: string): string[] {
  const lines = description.split("\n").map((line) => line.trim());
  const startIndex = lines.findIndex(isHeader);

  if (startIndex === -1) {
    return [];
  }

  const collected: string[] = [];

  for (const rawLine of lines.slice(startIndex + 1)) {
    if (!rawLine) {
      continue;
    }

    if (isHeader(rawLine)) {
      continue;
    }

    if (/^[A-Za-z].+:$/.test(rawLine) && collected.length > 0) {
      break;
    }

    const cleaned = rawLine.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").trim();

    if (cleaned) {
      collected.push(cleaned);
    }
  }

  return collected;
}
