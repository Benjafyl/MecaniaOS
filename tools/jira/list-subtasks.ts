import { jiraConfig } from "./config";

const auth = Buffer.from(`${jiraConfig.JIRA_EMAIL}:${jiraConfig.JIRA_API_TOKEN}`).toString("base64");

async function main() {
  const keys = process.argv.slice(2);

  if (keys.length === 0) {
    throw new Error("Usage: pnpm jira:issue:list-subtasks <ISSUE> [<ISSUE> ...]");
  }

  for (const key of keys) {
    const response = await fetch(
      `${jiraConfig.JIRA_BASE_URL}/rest/api/3/issue/${key}?fields=summary,status,subtasks`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${key} ${response.status}`);
    }

    const issue = (await response.json()) as {
      key: string;
      fields: {
        status?: { name?: string };
        subtasks?: Array<{
          key: string;
          fields?: {
            status?: { name?: string };
          };
        }>;
      };
    };

    console.log(
      JSON.stringify(
        {
          key: issue.key,
          status: issue.fields.status?.name ?? null,
          subtasks: (issue.fields.subtasks ?? []).map((subtask) => ({
            key: subtask.key,
            status: subtask.fields?.status?.name ?? null,
          })),
        },
        null,
        2,
      ),
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
