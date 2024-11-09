import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/services/api.service.ts";
import { RootState } from "@/redux/store.ts";
import { Task } from "@/types/task";

export const loadTasks = createAsyncThunk<Task[], string>('task/load', async (spaceId, thunkAPI) => {
  // const state = thunkAPI.getState() as RootState;
  // const {types, search, statuses, priorities, project} = state.task.filter;
  // return apiService.getTasks(spaceId, search, types, statuses, priorities, project).then(r => r.data);
  return []
});

export const loadSingleTask = createAsyncThunk('task/loadSingle', async () => {
  // const r = await apiService.getTask(spaceId, taskId);
  // return r.data;
  return []
});

export const updateTask = createAsyncThunk<any, { task: Task, spaceId: string }>('task/update', ({ task, spaceId }, thunkApi) => {
  // let newTask = {
  //   ...task,
  //   attachments: task.attachments.filter(item => !!item).map((attachment: any) => {
  //     if (typeof attachment !== 'string') {
  //       return attachment._id;
  //     }
  //     return attachment;
  //   })
  // }
  // return apiService.updateTask(spaceId, newTask);
})
