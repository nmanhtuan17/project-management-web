import apiService from "@/services/api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const activeInternalEmail = createAsyncThunk('active/email', async (payload: { alias: string }) => {
  const res = await apiService.post('users/email/active', payload)
  return res
})