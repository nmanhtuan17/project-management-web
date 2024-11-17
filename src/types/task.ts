import { ProjectMember } from "@/types/project";

export enum TaskTypes {
  ALL = 'all',
  GENERAL = 'general',
  ISSUE = 'issue',
  BUG = 'bug',
  TASK = 'task',
  INCIDENT = 'incident',
}

export enum TaskStatus {
  ALL = 'all',
  PENDING = 'pending',
  ON_GOING = 'on_going',
  REVIEW = 'review',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
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

export interface Task {
  _id: string;
  title: string;
  type: TaskTypes;
  status: TaskStatus;
  priority?: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  dueDate: Date;
  assignees: ProjectMember[];
  archived: boolean;
  attachments: string[] | any[];
  label?: string;
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
  cards: BoardTask[];
}
