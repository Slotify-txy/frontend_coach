import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/services/api';
import AUTH_STATUS from '../../common/constants/authStatus';

const slice = createSlice({
  name: 'auth',
  initialState: {
    userId: localStorage.getItem('userId')
      ? localStorage.getItem('userId')
      : null,
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
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      state.user = null;
      state.token = null;
      state.status = AUTH_STATUS.TOKEN_EXPIRED;
    },
    logout: (state) => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      state.user = null;
      state.token = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        const { token, id } = payload;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', id);
        state.token = token;
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.userId = id;
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
