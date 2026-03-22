import type { JiraAdfNode } from "./types";

function renderNode(node: JiraAdfNode): string {
  if (node.text) {
    return node.text;
  }

  const content = (node.content ?? []).map(renderNode).join("");

  switch (node.type) {
    case "paragraph":
      return `${content}\n`;
    case "heading":
      return `${content}\n`;
    case "bulletList":
    case "orderedList":
      return `${content}\n`;
    case "listItem":
      return `- ${content.trim()}\n`;
    case "hardBreak":
      return "\n";
    case "rule":
      return "\n---\n";
    default:
      return content;
  }
}

export function adfToPlainText(input: JiraAdfNode | string | null | undefined): string {
  if (!input) {
    return "";
  }

  if (typeof input === "string") {
    return input.trim();
  }

  const rendered = renderNode(input)
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();

  return rendered;
}
