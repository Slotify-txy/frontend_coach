import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/services/api';
import AUTH_STATUS from '../../common/constants/authStatus';

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('userToken')
      ? localStorage.getItem('userToken')
      : null,
    status: localStorage.getItem('userToken')
      ? AUTH_STATUS.AUTHENTICATED
      : AUTH_STATUS.UNAUTHENTICATED,
  },
  reducers: {
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = AUTH_STATUS.TOKEN_EXPIRED;
    },
    logout: (state) => {
      localStorage.removeItem('userToken');
      state.user = null;
      state.token = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        const { token } = payload;
        localStorage.setItem('userToken', token);
        state.token = token;
        state.status = AUTH_STATUS.AUTHENTICATED;
      })
      .addMatcher(
        api.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
        }
      );
  },
});

export const { clearCredentials, logout } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
