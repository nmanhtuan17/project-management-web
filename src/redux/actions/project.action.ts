import { slugify } from "@/lib/utils";
import apiService from "@/services/api.service";
import { Project, ProjectTypes } from "@/types/project";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadProjects = createAsyncThunk("project/load-projects", async () => {
  return await apiService.get('projects');
})

export const loadProjectMembers = createAsyncThunk<
  any,
  string
>('project/load-members', async (projectId) => {
  if (!projectId) throw Error('Invalid ProjectId');
  return await apiService.get(`projects/${projectId}/members`)
})

export const createProject = createAsyncThunk<
  any,
  any
>('project/create-project', async (payload) => {
  return await apiService.post('projects', payload)
})

export const loadKanbanBoard = createAsyncThunk("project/load-kanban-board", async (projectId: string) => {
  const { data } = await apiService.get(`projects/${projectId}/board`)
  return data
})

export const createKanbanColumn = createAsyncThunk("project/create-column", async (projectId: string) => {
  return await apiService.post(`projects/${projectId}/column`)
})

export const updateColumn = createAsyncThunk("project/update-column", async (payload: { projectId: string, columnId: string, title: string }) => {
  const { projectId, columnId, title } = payload
  return await apiService.put(`projects/${projectId}/column/${columnId}`, {
    id: slugify(title),
    title
  })
})