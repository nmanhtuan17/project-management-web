import { Project, ProjectLabel, ProjectMember } from '@/types/project';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createLabel, loadProjectLabels, loadProjectMembers, loadProjects } from '../actions/project.action';
import { toast } from 'sonner';

export interface ProjectSliceState {
  loading: boolean;
  projects: Project[];
  members: ProjectMember[];
  labels: ProjectLabel[];
}

const initialState: ProjectSliceState = {
  loading: false,
  projects: [],
  members: [],
  labels: []
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(loadProjectMembers.fulfilled, (state, action) => {
        state.members = action.payload
      })
      .addCase(createLabel.pending, (state) => {
        state.loading = true
      })
      .addCase(createLabel.fulfilled, (state, action) => {
        state.loading = false
        toast.success(action.payload.message)
      })
      .addCase(createLabel.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        toast.error(action.payload.message)
      })
      .addCase(loadProjectLabels.pending, (state) => {
        state.loading = true
      })
      .addCase(loadProjectLabels.fulfilled, (state, action) => {
        state.loading = false
        state.labels = action.payload.data
      })
      .addCase(loadProjectLabels.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false
        toast.error(action.payload.message)
      })
  }
});

export const {
} = projectSlice.actions;
