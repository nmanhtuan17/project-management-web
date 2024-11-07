import apiService from "@/services/api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadProjects = createAsyncThunk("projects-load", async () => {
  const res = await apiService.get('projects');
  console.log(res)
  return res
})

export const loadProjectMembers = createAsyncThunk<
  any,
  string
>('project-load-members', async (projectId) => {
  if (!projectId) throw Error('Invalid ProjectId');
  return await apiService.get(`projects/${projectId}/members`)
})