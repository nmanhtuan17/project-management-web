import apiService from "@/services/api.service";
import { Project, ProjectLabel, ProjectTypes } from "@/types/project";
import { slugify } from "@/utils";
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

export const createKanbanColumn = createAsyncThunk("project/create-column", async (payload: { projectId: string, title: string, backgroundColor: string }) => {
  const { projectId, title, backgroundColor } = payload;
  return await apiService.post(`projects/${projectId}/column`, {
    id: slugify(title),
    title,
    backgroundColor
  })
})

export const updateColumn = createAsyncThunk("project/update-column", async (payload: { projectId: string, columnId: string, title: string }) => {
  const { projectId, columnId, title } = payload
  return await apiService.put(`projects/${projectId}/column/${columnId}`, {
    id: slugify(title),
    title
  })
})

export const removeColumn = createAsyncThunk('project/remove-column', async (payload: { projectId: string, columnId: string }) => {
  const { projectId, columnId } = payload;
  return await apiService.delete(`projects/${projectId}/column/${columnId}`, {})
})

export const createLabel = createAsyncThunk<
  {
    data: ProjectLabel,
    message: string
  },
  { projectId: string, payload: Partial<ProjectLabel> }
>('project/create-label', async ({ projectId, payload }, thunkApi) => {
  return await apiService.post(`projects/${projectId}/label`, payload)
})

export const loadProjectLabels = createAsyncThunk<
  {
    data: ProjectLabel[],
    message: string
  },
  string
>('project/load-labels', async (projectId) => {

  return await apiService.get(`projects/${projectId}/labels`)
})