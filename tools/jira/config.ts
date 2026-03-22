import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

function loadLocalEnvFile(filePath: string, override = false) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    if (override || !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadLocalEnvFile(path.join(process.cwd(), ".env"));
loadLocalEnvFile(path.join(process.cwd(), ".env.local"), true);

const jiraEnvSchema = z.object({
  JIRA_BASE_URL: z.string().url(),
  JIRA_EMAIL: z.string().email(),
  JIRA_API_TOKEN: z.string().min(10),
  JIRA_PROJECT_KEY: z.string().min(1),
  JIRA_BOARD_ID: z.coerce.number().int().positive(),
  ACCEPTANCE_CRITERIA_LOCATION: z.enum(["description", "custom_field", "comments", "subtasks"]),
  JIRA_ACCEPTANCE_CRITERIA_FIELD: z.string().optional(),
});

function normalizeBaseUrl(baseUrl: string) {
  const url = new URL(baseUrl);
  return `${url.protocol}//${url.host}`;
}

export const jiraEnv = jiraEnvSchema.parse({
  JIRA_BASE_URL: process.env.JIRA_BASE_URL,
  JIRA_EMAIL: process.env.JIRA_EMAIL,
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
  JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY,
  JIRA_BOARD_ID: process.env.JIRA_BOARD_ID,
  ACCEPTANCE_CRITERIA_LOCATION: process.env.ACCEPTANCE_CRITERIA_LOCATION,
  JIRA_ACCEPTANCE_CRITERIA_FIELD: process.env.JIRA_ACCEPTANCE_CRITERIA_FIELD,
});

export const jiraConfig = {
  ...jiraEnv,
  JIRA_BASE_URL: normalizeBaseUrl(jiraEnv.JIRA_BASE_URL),
};
