export type JiraPrimitive = string | number | boolean | null;

export type JiraAdfNode = {
  type?: string;
  text?: string;
  content?: JiraAdfNode[];
  marks?: Array<{ type?: string }>;
  attrs?: Record<string, JiraPrimitive | JiraPrimitive[] | Record<string, JiraPrimitive>>;
};

export type JiraIssueType = {
  id: string;
  name: string;
};

export type JiraIssueStatus = {
  id: string;
  name: string;
};

export type JiraTransitionsResponse = {
  transitions: Array<{
    id: string;
    name: string;
    to: JiraIssueStatus;
  }>;
};

export type JiraIssueFields = {
  summary?: string;
  description?: JiraAdfNode | string | null;
  labels?: string[];
  priority?: { name?: string } | null;
  status?: JiraIssueStatus | null;
  issuetype?: JiraIssueType | null;
  assignee?: { displayName?: string; emailAddress?: string } | null;
  customfield_10020?: Array<{ id?: number; name?: string; state?: string }> | null;
  [key: string]: unknown;
};

export type JiraIssue = {
  id: string;
  key: string;
  fields: JiraIssueFields;
};

export type JiraSprint = {
  id: number;
  name: string;
  state: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
};

export type NormalizedIssue = {
  id: string;
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string[];
  status: string;
  priority?: string;
  issueType: string;
  labels: string[];
  assignee?: string;
  sprint?: string;
  jiraUrl: string;
};

export type SprintSnapshot = {
  syncedAt: string;
  projectKey: string;
  boardId: number;
  sprint: JiraSprint;
  issues: NormalizedIssue[];
};
