import { Project, ProjectMember } from '@/types/project';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadProjectMembers, loadProjects } from '../actions/project.action';

export interface ProjectSliceState {
  loaded: boolean;
  loading: boolean;
  projects: Project[];
  members: ProjectMember[];
}

const initialState: ProjectSliceState = {
  loaded: false,
  loading: false,
  projects: [],
  members: []
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state, action) => {
        state.loaded = true;
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.loaded = false
        state.projects = action.payload
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.loaded = false
      })
      .addCase(loadProjectMembers.fulfilled, (state, action) => {
        state.members = action.payload
      })
  }
});

export const {
} = projectSlice.actions;
