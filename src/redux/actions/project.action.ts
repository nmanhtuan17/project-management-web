import apiService from "@/services/api.service";
import { Milestone, MilestoneFilter, Project, ProjectAttachment, ProjectLabel, ProjectTypes } from "@/types/project";
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

export const loadMilestones = createAsyncThunk<any,
  { projectId: string, filter: MilestoneFilter }
>('project/load-milestones', async (payload) => {
  console.log(payload)
  return await apiService.get(`projects/${payload.projectId}/milestones`, {}, {
    params: {
      closed: payload.filter.closed ?? undefined,
      query: payload.filter.query ?? ''
    }
  })
})

export const createMilestone = createAsyncThunk<
  any,
  {
    projectId: string,
    milestone: Partial<Milestone>
  }
>('project/create-milestone', async (payload, thunkApi) => {
  const data = await apiService.post(`projects/${payload.projectId}/milestones`, payload.milestone)
  thunkApi.dispatch(loadMilestones({ projectId: payload.projectId, filter: { query: '' } }))
  return data
})

export const getStatistics = createAsyncThunk('projects/statistic', async () => {
  return await apiService.get('projects/statistics')
})

export const getAttachments = createAsyncThunk<
  { data: ProjectAttachment[], message: string },
  string
>('project/attachments', async (project) => {
  return await apiService.getAttachments(project)
})

export const uploadAttachment = createAsyncThunk<
  { data: ProjectAttachment, message: string },
  { project: string, attachment: FormData }
>('project/attachment-upload', async ({ project, attachment }, thunkAPI) => {
  const res = await apiService.uploadAttachment(project, attachment)
  thunkAPI.dispatch(getAttachments(project))
  return res
})
export const deleteAttachment = createAsyncThunk<
  { message: string },
  { project: string, attachment: string }
>('project/attachment-delete', async ({ project, attachment }, thunkAPI) => {
  const res = await apiService.deleteAttachment(project, attachment)
  thunkAPI.dispatch(getAttachments(project))
  return res
})