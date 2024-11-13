import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AuthSliceState {
  loggedIn: boolean;
  tokens: {
    access_token?: string;
    refresh_token?: string;
  },
  user?: {
    _id: string;
    avatar: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    googleId: string;
    role: string;
    missingPassword?: boolean;
  }
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

  }
});

export const {
  setAuth,
} = authSlice.actions;
