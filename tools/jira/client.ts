import { jiraConfig } from "./config";
import type { JiraIssue, JiraSprint, JiraTransitionsResponse } from "./types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
};

async function jiraRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${jiraConfig.JIRA_BASE_URL}${path}`;
  const auth = Buffer.from(`${jiraConfig.JIRA_EMAIL}:${jiraConfig.JIRA_API_TOKEN}`).toString("base64");
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Jira request failed (${response.status}) ${path}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getCurrentSprint(boardId = jiraConfig.JIRA_BOARD_ID) {
  const data = await jiraRequest<{ values: JiraSprint[] }>(
    `/rest/agile/1.0/board/${boardId}/sprint?state=active,future`,
  );

  const sprint = data.values.find((item) => item.state === "active") ?? data.values[0];

  if (!sprint) {
    throw new Error(`No active or future sprint found for board ${boardId}.`);
  }

  return sprint;
}

export async function getSprintIssues(sprintId: number) {
  const collected: JiraIssue[] = [];
  let startAt = 0;
  const maxResults = 50;

  while (true) {
    const page = await jiraRequest<{
      issues: JiraIssue[];
      startAt: number;
      maxResults: number;
      total: number;
    }>(
      `/rest/agile/1.0/sprint/${sprintId}/issue?startAt=${startAt}&maxResults=${maxResults}`,
    );

    collected.push(...page.issues);
    startAt += page.maxResults;

    if (collected.length >= page.total) {
      break;
    }
  }

  return collected;
}

export async function getIssue(issueKey: string) {
  return jiraRequest<JiraIssue>(
    `/rest/api/3/issue/${issueKey}?fields=summary,description,status,issuetype,priority,labels,assignee,customfield_10020`,
  );
}

export async function getTransitions(issueKey: string) {
  return jiraRequest<JiraTransitionsResponse>(`/rest/api/3/issue/${issueKey}/transitions`);
}

export async function commentOnIssue(issueKey: string, comment: string) {
  return jiraRequest(`/rest/api/3/issue/${issueKey}/comment`, {
    method: "POST",
    body: {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: comment }],
          },
        ],
      },
    },
  });
}

export async function transitionIssue(issueKey: string, transitionId: string) {
  return jiraRequest(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: {
      transition: { id: transitionId },
    },
  });
}

export async function createSprint(input: {
  name: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  boardId?: number;
}) {
  return jiraRequest<JiraSprint>("/rest/agile/1.0/sprint", {
    method: "POST",
    body: {
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      goal: input.goal,
      originBoardId: input.boardId ?? jiraConfig.JIRA_BOARD_ID,
    },
  });
}

export async function createIssue(input: {
  summary: string;
  description: string;
  issueType?: string;
}) {
  return jiraRequest<{ id: string; key: string }>("/rest/api/3/issue", {
    method: "POST",
    body: {
      fields: {
        project: { key: jiraConfig.JIRA_PROJECT_KEY },
        summary: input.summary,
        issuetype: { name: input.issueType ?? "Story" },
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: input.description }],
            },
          ],
        },
      },
    },
  });
}

export async function updateIssueDescription(issueKey: string, description: string) {
  return jiraRequest(`/rest/api/3/issue/${issueKey}`, {
    method: "PUT",
    body: {
      fields: {
        description: {
          type: "doc",
          version: 1,
          content: description.split("\n").map((line) => ({
            type: "paragraph",
            content: line
              ? [
                  {
                    type: "text",
                    text: line,
                  },
                ]
              : [],
          })),
        },
      },
    },
  });
}
