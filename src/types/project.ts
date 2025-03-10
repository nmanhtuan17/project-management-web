import { User } from "@/types/member";
import { Task } from "@/types/task";

export enum ProjectTypes {
  PERSONAL = 'personal',
  TEAM = 'team'
}

export enum ProjectRoles {
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member'
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  type: ProjectTypes;
  memberCount?: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  _id: string;
  user: User;
  project: Project | string;
  role: ProjectRoles;
}

export interface ProjectLabel {
  _id: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  time: {
    from: Date,
    to: Date
  },
  project: string
  tasks: Task[]
}