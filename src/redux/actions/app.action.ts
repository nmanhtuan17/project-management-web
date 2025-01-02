import apiService from "@/services/api.service";
import { User } from "@/types/member";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const activeInternalEmail = createAsyncThunk('active/email', async (payload: { alias: string }) => {
  const res = await apiService.post('users/email/active', payload)
  return res
})

export const updateProfile = createAsyncThunk<
  any,
  Partial<User>
>('profile/update', async (payload) => {
  return await apiService.post('users', payload)
})