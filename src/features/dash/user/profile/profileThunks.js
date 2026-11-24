import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "@/features/auth";
import * as profileApi from "./profileApi";
import { formToUpdatePayload } from "./profileMappers";

/**
 * User profile async thunks — orchestration only; HTTP in profileApi.
 */

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
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
  {
    condition: (_, { getState }) => {
      // Avoid duplicate concurrent /users/me calls from layout + page mounts
      return !getState().userProfile.loading;
    },
  },
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const payload = formToUpdatePayload(form);
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

export const changeUserPassword = createAsyncThunk(
  "userProfile/changeUserPassword",
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

export const fetchMemberProfile = createAsyncThunk(
  "userProfile/fetchMemberProfile",
  async (userId, { rejectWithValue }) => {
    try {
      return await profileApi.getMemberProfile(userId);
    } catch (err) {
      return rejectWithValue(
        profileApi.getApiErrorMessage(err, "Failed to load member profile"),
      );
    }
  },
);
