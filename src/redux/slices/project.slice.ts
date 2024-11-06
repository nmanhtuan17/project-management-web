import { Project } from '@/types/project';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectSliceState {
  loaded: boolean;
  projects: Project[]
}

const initialState: ProjectSliceState = {
  loaded: false,
  projects: []
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {

  }
});

export const {
} = projectSlice.actions;
