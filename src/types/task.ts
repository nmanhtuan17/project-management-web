import { Milestone, Project, ProjectLabel, ProjectMember } from "@/types/project";

export enum TaskTypes {
  ALL = 'all',
  GENERAL = 'general',
  ISSUE = 'issue',
  BUG = 'bug',
}

export enum TaskPriority {
  ALL = 'all',
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum TaskActivityType {
  Update = 'update',
  Comment = 'comment',
  Mention = 'mention',
  Other = 'other',
  Push = 'push',
  Deployment = 'deployment',
}

export enum ETaskStatus {
  ALL = 'all',
  TODO = 'to-do',
  INPROCESS = 'in-progress',
  DONE = 'done'
}

export interface TaskFilter {
  query?: string
  type: string
  priority?: string
  status?: string
  assignees?: string
}

export interface Task {
  _id: string;
  title: string;
  type: TaskTypes;
  status: string;
  priority?: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  time: {
    from: Date,
    to: Date
  };
  assignees: ProjectMember[];
  archived: boolean;
  attachments: string[] | any[];
  labels?: ProjectLabel[];
  milestone?: Milestone;
  __v?: number;
  parentTask: string;
}

export interface TaskActivity {
  _id: string;
  type: TaskActivityType;
  task: Task | string;
  field?: string;
  member: ProjectMember | string;
  meta?: any;
  linkedItemId?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  from: ProjectMember;
  text: string;
  createdAt: string;
  updatedAt: string;
  photo?: string;
  post: string;
}


export interface Board {
  columns: BoardColumn[];
}

export interface BoardTask extends Task {
  id: string;
}

export interface BoardColumn {
  _id?: string;
  id: string;
  title: string;
  backgroundColor: string;
  cards: BoardTask[];
}
