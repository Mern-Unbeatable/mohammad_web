import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "@/features/auth";
import * as profileApi from "./profileApi";
import { formToUpdatePayload } from "./profileMappers";

/**
 * Supplier profile async thunks — orchestration only; HTTP in profileApi.
 */

export const fetchSupplierProfile = createAsyncThunk(
  "supplierProfile/fetchSupplierProfile",
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

export const updateSupplierProfile = createAsyncThunk(
  "supplierProfile/updateSupplierProfile",
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

export const changeSupplierPassword = createAsyncThunk(
  "supplierProfile/changeSupplierPassword",
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
