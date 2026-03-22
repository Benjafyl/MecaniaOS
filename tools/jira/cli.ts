import { readFile } from "node:fs/promises";

import {
  commentOnIssue,
  createIssue,
  createSprint,
  getCurrentSprint,
  getIssue,
  getTransitions,
  transitionIssue,
  updateIssueDescription,
} from "./client";
import { buildCurrentSprintSnapshot, writeCurrentSprintSnapshot } from "./snapshot";
import { adfToPlainText } from "./adf";
import { extractAcceptanceCriteria } from "./acceptance";

function readArg(flag: string, args: string[]) {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function requireArg(flag: string, args: string[]) {
  const value = readArg(flag, args);
  if (!value) {
    throw new Error(`Missing required argument ${flag}`);
  }
  return value;
}

async function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "sprint:current": {
      const sprint = await getCurrentSprint();
      console.log(JSON.stringify(sprint, null, 2));
      return;
    }
    case "sprint:sync": {
      const snapshot = await buildCurrentSprintSnapshot();
      await writeCurrentSprintSnapshot(snapshot);
      console.log(
        JSON.stringify(
          {
            sprint: snapshot.sprint.name,
            state: snapshot.sprint.state,
            issues: snapshot.issues.length,
            output: ["docs/sprints/current-sprint.json", "docs/sprints/current-sprint.md"],
          },
          null,
          2,
        ),
      );
      return;
    }
    case "issue:get": {
      const key = requireArg("--key", args);
      const issue = await getIssue(key);
      const description = adfToPlainText(issue.fields.description);
      console.log(
        JSON.stringify(
          {
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status?.name,
            issueType: issue.fields.issuetype?.name,
            priority: issue.fields.priority?.name,
            labels: issue.fields.labels ?? [],
            description,
            acceptanceCriteria: extractAcceptanceCriteria(description),
          },
          null,
          2,
        ),
      );
      return;
    }
    case "issue:comment": {
      const key = requireArg("--key", args);
      const comment = requireArg("--comment", args);
      await commentOnIssue(key, comment);
      console.log(`Comment added to ${key}`);
      return;
    }
    case "issue:update-description": {
      const key = requireArg("--key", args);
      const file = readArg("--file", args);
      const descriptionArg = readArg("--description", args);
      const description = file ? await readFile(file, "utf8") : descriptionArg;

      if (!description) {
        throw new Error("Provide --file or --description");
      }

      await updateIssueDescription(key, description.trim());
      console.log(`Description updated for ${key}`);
      return;
    }
    case "issue:transition": {
      const key = requireArg("--key", args);
      const target = requireArg("--to", args);
      const transitions = await getTransitions(key);
      const match = transitions.transitions.find(
        (transition) =>
          transition.name.toLowerCase() === target.toLowerCase() ||
          transition.to.name.toLowerCase() === target.toLowerCase(),
      );

      if (!match) {
        throw new Error(
          `Transition "${target}" not found for ${key}. Available: ${transitions.transitions
            .map((transition) => transition.name)
            .join(", ")}`,
        );
      }

      await transitionIssue(key, match.id);
      console.log(`Transitioned ${key} to ${match.to.name}`);
      return;
    }
    case "sprint:create": {
      const name = requireArg("--name", args);
      const startDate = readArg("--start", args);
      const endDate = readArg("--end", args);
      const goal = readArg("--goal", args);
      const sprint = await createSprint({ name, startDate, endDate, goal });
      console.log(JSON.stringify(sprint, null, 2));
      return;
    }
    case "issue:create": {
      const summary = requireArg("--summary", args);
      const description = requireArg("--description", args);
      const issueType = readArg("--type", args);
      const issue = await createIssue({ summary, description, issueType });
      console.log(JSON.stringify(issue, null, 2));
      return;
    }
    default:
      throw new Error(
        [
          "Unknown command.",
          "Available commands:",
          "  sprint:current",
          "  sprint:sync",
          "  sprint:create --name <name> [--start ISO] [--end ISO] [--goal text]",
          "  issue:get --key <MOS-1>",
          "  issue:comment --key <MOS-1> --comment <text>",
          "  issue:update-description --key <MOS-1> --file <path>",
          "  issue:transition --key <MOS-1> --to <status>",
          "  issue:create --summary <text> --description <text> [--type Story]",
        ].join("\n"),
      );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
