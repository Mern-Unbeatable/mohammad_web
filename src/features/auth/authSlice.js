import { createSlice } from "@reduxjs/toolkit";
import { tokenService } from "@/api/cookies";
import { unwrapUser } from "@/api/unwrapApiData";
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  refreshSession,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from "./authThunks";

/** Heal cookies/state if an older bug stored the API envelope as `user`. */
const coerceStoredUser = (raw) => {
  if (!raw || typeof raw !== "object") return raw;
  if (raw.role || raw.email || raw.id) return raw;
  return unwrapUser(raw) || raw;
};

const initialUser = coerceStoredUser(tokenService.getUser());

if (
  initialUser &&
  typeof initialUser === "object" &&
  initialUser.role &&
  tokenService.getUser() &&
  !tokenService.getUser().role
) {
  tokenService.setUser(initialUser);
}

const initialState = {
  user: initialUser,
  token: tokenService.getToken(),
  isAuthenticated: !!(tokenService.getToken() && initialUser),
  loading: false,
  error: null,
  sessionReady: !tokenService.getToken(),
  loggingOut: false,
};

const applyReset = (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  state.sessionReady = true;
  state.loggingOut = false;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      applyReset(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionReady: (state, action) => {
      state.sessionReady = Boolean(action.payload);
    },
    tokenRefreshed: (state, action) => {
      state.token = action.payload || tokenService.getToken();
      state.isAuthenticated = !!(state.token && state.user);
    },
    setUser: (state, action) => {
      const user = coerceStoredUser(action.payload) || null;
      state.user = user;
      if (user) tokenService.setUser(user);
      state.isAuthenticated = !!(state.token && user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.accessToken || null;
        state.sessionReady = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.accessToken || null;
        state.sessionReady = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile bootstrap
      .addCase(fetchUserProfile.pending, (state) => {
        state.sessionReady = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = tokenService.getToken();
        state.isAuthenticated = !!(action.payload && state.token);
        state.sessionReady = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionReady = true;
        state.error = action.payload;
      })
      // Refresh
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.token = action.payload?.accessToken || tokenService.getToken();
        state.isAuthenticated = !!(state.token && state.user);
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionReady = true;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loggingOut = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        applyReset(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        applyReset(state);
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot / reset password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetAuth,
  clearError,
  setSessionReady,
  tokenRefreshed,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
