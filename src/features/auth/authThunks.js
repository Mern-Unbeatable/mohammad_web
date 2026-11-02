import { createAsyncThunk } from "@reduxjs/toolkit";
import { tokenService } from "@/config";
import * as authApi from "./authApi";

/**
 * Auth async thunks — orchestration only; HTTP lives in authApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Login
// ═══════════════════════════════════════════════════════════════════════
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Invalid email or password"),
        {
          status: err?.status ?? null,
          code: err?.code ?? null,
          details: err?.details ?? null,
        },
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Register
// ═══════════════════════════════════════════════════════════════════════
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { remember = true, ...body } = formData || {};
      return await authApi.register(body, { remember });
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Registration failed"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Fetch profile (bootstrap / revalidate)
// ═══════════════════════════════════════════════════════════════════════
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (err) {
      // Access token missing/expired → try a cookie-based refresh once, then me.
      try {
        await authApi.refresh();
        return await authApi.me();
      } catch {
        // fall through
      }
      tokenService.clearAuth();
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to fetch user profile"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Bootstrap session (app load) — tokens are httpOnly cookies invisible to JS,
// so we attempt a silent cookie-based refresh. Uses the bare client (no 401
// interceptor) so a logged-out visitor is never redirected away from public
// pages.
// ═══════════════════════════════════════════════════════════════════════
export const bootstrapSession = createAsyncThunk(
  "auth/bootstrapSession",
  async (_, { rejectWithValue }) => {
    if (!tokenService.getToken()) {
      try {
        await authApi.refresh();
      } catch {
        return rejectWithValue(null);
      }
    }
    try {
      return await authApi.me();
    } catch (err) {
      tokenService.clearAuth();
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to restore session"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Refresh session
// ═══════════════════════════════════════════════════════════════════════
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refresh();
    } catch (err) {
      tokenService.clearAuth();
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Session expired"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Logout
// ═══════════════════════════════════════════════════════════════════════
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    try {
      await authApi.logout();
    } catch {
      tokenService.clearAuth();
    }
  },
  { condition: (_, { getState }) => !getState().auth?.loggingOut },
);

// ═══════════════════════════════════════════════════════════════════════
// Forgot / reset password
// ═══════════════════════════════════════════════════════════════════════
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to send reset link"),
      );
    }
  },
);

// `meta.status` lets the page tell an invalid/expired link (400) apart from
// validation (422), rate-limit (429) and network errors.
export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      return await authApi.verifyResetToken(token);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Could not check this reset link"),
        { status: err?.status ?? null },
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (input, { rejectWithValue }) => {
    try {
      return await authApi.resetPassword(input);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to reset password"),
        { status: err?.status ?? null },
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Change password
// ═══════════════════════════════════════════════════════════════════════
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (input, { rejectWithValue }) => {
    try {
      return await authApi.changePassword(input);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to change password"),
      );
    }
  },
);
