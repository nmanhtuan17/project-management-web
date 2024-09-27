import { createSlice } from "@reduxjs/toolkit";

export interface AppSliceState {

}

const initialState: AppSliceState = {

}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {

  }
})