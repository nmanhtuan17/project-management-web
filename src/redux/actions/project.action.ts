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