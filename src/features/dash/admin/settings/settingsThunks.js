import { createAsyncThunk } from "@reduxjs/toolkit";
import * as settingsApi from "./settingsApi";

/**
 * Admin settings async thunks — orchestration only; HTTP in settingsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Load all settings
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminSettings = createAsyncThunk(
  "adminSettings/fetchAdminSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsApi.getSettings();
    } catch (err) {
      return rejectWithValue(
        settingsApi.getApiErrorMessage(err, "Failed to load settings"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Save one setting
// ═══════════════════════════════════════════════════════════════════════
export const saveAdminSetting = createAsyncThunk(
  "adminSettings/saveAdminSetting",
  async ({ key, value }, { rejectWithValue }) => {
    try {
      const result = await settingsApi.upsertSetting(key, value);
      return { key, value: result?.value ?? value };
    } catch (err) {
      return rejectWithValue(
        settingsApi.getApiErrorMessage(err, "Failed to save setting"),
      );
    }
  },
);
