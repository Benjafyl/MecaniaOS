import { readFile } from "node:fs/promises";

import { updateIssueDescription } from "./client";

type BulkUpdateItem = {
  key: string;
  description: string;
};

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Usage: pnpm jira:issue:bulk-update <path-to-json>");
  }

  const raw = await readFile(filePath, "utf8");
  const items = JSON.parse(raw) as BulkUpdateItem[];

  for (const item of items) {
    if (!item.key || !item.description) {
      throw new Error("Every bulk update item must include key and description.");
    }

    console.log(`Updating ${item.key}...`);
    await updateIssueDescription(item.key, item.description.trim());
  }

  console.log(`Updated ${items.length} issues.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
