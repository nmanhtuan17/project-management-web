import { User } from '@/types/member';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activeInternalEmail } from '../actions/app.action';
import { toast } from 'sonner';

export interface AuthSliceState {
  loggedIn: boolean;
  tokens: {
    access_token?: string;
    refresh_token?: string;
  },
  user?: User
}

const initialState: AuthSliceState = {
  loggedIn: false,
  tokens: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<Partial<AuthSliceState>>) {
      state = {
        ...state,
        ...action.payload,
      }
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(activeInternalEmail.fulfilled, (state, action) => {
        state.user = action.payload.data
        toast.success(action.payload.message)
      })
  }
});

export const {
  setAuth,
} = authSlice.actions;
