import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/services/api.service.ts";
import { RootState } from "@/redux/store.ts";
import { ETaskStatus, Task, TaskPriority, TaskTypes } from "@/types/task";

export const loadTasks = createAsyncThunk<Task[], {
  projectId: string,
  query?: string
}>('task/load', async ({ projectId, query }, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { types, statuses, priorities, assignees } = state.task.filter;
  const { data } = await apiService.get(`projects/${projectId}/tasks`, {}, {
    params: {
      query: query || '',
      type: types?.join(',') || TaskTypes.ALL,
      status: statuses?.join(',') || ETaskStatus.ALL,
      priority: priorities?.join(',') || TaskPriority.ALL,
      assignees: assignees?.join(',') || undefined,
      limit: 100
    }
  })
  return data
});

export const loadRecentTask = createAsyncThunk<Task[], { projectId: string, assignee: string }>('task/load-recent', async ({ projectId, assignee }, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const { data } = await apiService.get(`projects/${projectId}/tasks`, {}, {
    params: {
      type: 'all',
      assignees: assignee,
      sortItem: 'updatedAt',
      sortType: 'desc',
      limit: 4
    }
  })
  return data
});

export const loadSingleTask = createAsyncThunk<
  Task,
  { projectId: string, taskId: string }
>('task/loadSingle', async ({ projectId, taskId }) => {
  const r = await apiService.get(`projects/${projectId}/tasks/${taskId}`);
  return r.data;
});

export const updateTask = createAsyncThunk<any, { task: Task, projectId: string }>('task/update', async ({ task, projectId }, thunkApi) => {
  let newTask = {
    ...task,
    labels: task?.labels && task.labels.map(item => item?._id || item),
    milestone: task?.milestone && task.milestone?._id || task.milestone,
    attachments: task.attachments.filter(item => !!item).map((attachment: any) => {
      if (typeof attachment !== 'string') {
        return attachment._id;
      }
      return attachment;
    })
  }
  return await apiService.put(`projects/${projectId}/tasks/${task._id}`, newTask);
})
