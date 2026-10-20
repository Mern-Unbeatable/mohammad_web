import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "@/features/auth";
import * as profileApi from "./profileApi";
import { nameToProfilePayload } from "./profileMappers";

/**
 * Admin profile async thunks — orchestration only; HTTP in profileApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Load profile
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminProfile = createAsyncThunk(
  "adminProfile/fetchAdminProfile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = await profileApi.getProfile();
      dispatch(setUser(user));
      return user;
    } catch (err) {
      return rejectWithValue(
        profileApi.getApiErrorMessage(err, "Failed to load profile"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Update profile (name)
// ═══════════════════════════════════════════════════════════════════════
export const updateAdminProfile = createAsyncThunk(
  "adminProfile/updateAdminProfile",
  async (fullName, { rejectWithValue, dispatch }) => {
    try {
      const payload = nameToProfilePayload(fullName);
      const user = await profileApi.updateProfile(payload);
      dispatch(setUser(user));
      return user;
    } catch (err) {
      return rejectWithValue(
        profileApi.getApiErrorMessage(err, "Failed to update profile"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Update profile image (upload → PATCH avatarUrl)
// ═══════════════════════════════════════════════════════════════════════
export const updateAdminAvatar = createAsyncThunk(
  "adminProfile/updateAdminAvatar",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const uploaded = await profileApi.uploadFile(file);
      const user = await profileApi.updateProfile({ avatarUrl: uploaded.url });
      dispatch(setUser(user));
      return user;
    } catch (err) {
      return rejectWithValue(
        profileApi.getApiErrorMessage(err, "Failed to update profile image"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Change password
// ═══════════════════════════════════════════════════════════════════════
export const changeAdminPassword = createAsyncThunk(
  "adminProfile/changeAdminPassword",
  async (input, { rejectWithValue }) => {
    try {
      return await profileApi.changePassword(input);
    } catch (err) {
      return rejectWithValue(
        profileApi.getApiErrorMessage(err, "Failed to change password"),
      );
    }
  },
);
