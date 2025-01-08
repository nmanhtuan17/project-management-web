import { ThemeMode } from "@/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateProfile } from "../actions/app.action";
import { createLabel } from "@/redux/actions/project.action";

export interface AppSliceState {
  loading: boolean;
  theme: ThemeMode;
}

const initialState: AppSliceState = {
  loading: false,
  theme: ThemeMode.LIGHT,
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppSliceState['theme']>) {
      state.theme = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
      })
      
  }
})