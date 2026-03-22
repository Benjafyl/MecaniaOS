import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { adfToPlainText } from "./adf";
import { extractAcceptanceCriteria } from "./acceptance";
import { jiraConfig } from "./config";
import { getCurrentSprint, getIssue, getSprintIssues } from "./client";
import type { JiraIssue, SprintSnapshot } from "./types";

function normalizeIssue(issue: JiraIssue, sprintName: string) {
  const description = adfToPlainText(issue.fields.description);

  return {
    id: issue.id,
    key: issue.key,
    summary: issue.fields.summary ?? "",
    description,
    acceptanceCriteria:
      jiraConfig.ACCEPTANCE_CRITERIA_LOCATION === "description"
        ? extractAcceptanceCriteria(description)
        : [],
    status: issue.fields.status?.name ?? "Unknown",
    priority: issue.fields.priority?.name,
    issueType: issue.fields.issuetype?.name ?? "Unknown",
    labels: issue.fields.labels ?? [],
    assignee: issue.fields.assignee?.displayName,
    sprint: sprintName,
    jiraUrl: `${jiraConfig.JIRA_BASE_URL}/browse/${issue.key}`,
  };
}

function formatMarkdown(snapshot: SprintSnapshot) {
  const lines: string[] = [
    `# ${snapshot.sprint.name}`,
    "",
    `- Project: ${snapshot.projectKey}`,
    `- Board ID: ${snapshot.boardId}`,
    `- State: ${snapshot.sprint.state}`,
    `- Synced at: ${snapshot.syncedAt}`,
  ];

  if (snapshot.sprint.goal) {
    lines.push(`- Goal: ${snapshot.sprint.goal}`);
  }

  lines.push("", "## Issues", "");

  for (const issue of snapshot.issues) {
    lines.push(`### ${issue.key} - ${issue.summary}`);
    lines.push(`- Status: ${issue.status}`);
    lines.push(`- Type: ${issue.issueType}`);
    if (issue.priority) {
      lines.push(`- Priority: ${issue.priority}`);
    }
    if (issue.assignee) {
      lines.push(`- Assignee: ${issue.assignee}`);
    }
    lines.push(`- Jira: ${issue.jiraUrl}`);
    lines.push("");
    lines.push("Description:");
    lines.push(issue.description || "(No description)");
    lines.push("");
    lines.push("Acceptance Criteria:");
    if (issue.acceptanceCriteria.length === 0) {
      lines.push("- (Not found in description)");
    } else {
      for (const criterion of issue.acceptanceCriteria) {
        lines.push(`- ${criterion}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function buildCurrentSprintSnapshot(): Promise<SprintSnapshot> {
  const sprint = await getCurrentSprint();
  const issues = await getSprintIssues(sprint.id);
  const hydratedIssues = await Promise.all(issues.map((issue) => getIssue(issue.key)));

  return {
    syncedAt: new Date().toISOString(),
    projectKey: jiraConfig.JIRA_PROJECT_KEY,
    boardId: jiraConfig.JIRA_BOARD_ID,
    sprint,
    issues: hydratedIssues.map((issue) => normalizeIssue(issue, sprint.name)),
  };
}

export async function writeCurrentSprintSnapshot(snapshot: SprintSnapshot) {
  const docsDir = path.join(process.cwd(), "docs", "sprints");
  await mkdir(docsDir, { recursive: true });
  await writeFile(path.join(docsDir, "current-sprint.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await writeFile(path.join(docsDir, "current-sprint.md"), `${formatMarkdown(snapshot)}\n`, "utf8");
}
