import { User } from "@/types/member";

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
}

export interface ProjectMember {
  _id: string;
  user: User;
  project: Project | string;
  role: ProjectRoles;
}