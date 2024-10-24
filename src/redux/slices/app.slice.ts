import { ThemeMode } from "@/enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppSliceState {
  theme: ThemeMode;
}

const initialState: AppSliceState = {
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

  }
})