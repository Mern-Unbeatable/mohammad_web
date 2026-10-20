import { createAsyncThunk } from "@reduxjs/toolkit";
import * as usersApi from "./usersApi";

/**
 * Admin users async thunks — orchestration only; HTTP lives in usersApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Users list
// ═══════════════════════════════════════════════════════════════════════
export const fetchUsersList = createAsyncThunk(
  "adminUsers/fetchUsersList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await usersApi.getUsersList(params);
    } catch (err) {
      return rejectWithValue(
        usersApi.getApiErrorMessage(err, "Failed to load users list"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// User details
// ═══════════════════════════════════════════════════════════════════════
export const fetchUserDetails = createAsyncThunk(
  "adminUsers/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      return await usersApi.getUserById(userId);
    } catch (err) {
      return rejectWithValue(
        usersApi.getApiErrorMessage(err, "Failed to load user details"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// User status
// ═══════════════════════════════════════════════════════════════════════
export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateUserStatus",
  async ({ userId, status, reason }, { rejectWithValue }) => {
    try {
      return await usersApi.patchUserStatus(userId, status, reason);
    } catch (err) {
      return rejectWithValue(
        usersApi.getApiErrorMessage(err, "Failed to update user status"),
      );
    }
  },
);
