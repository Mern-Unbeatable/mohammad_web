import { createAsyncThunk } from "@reduxjs/toolkit";
import * as dashApi from "./dashApi";

/**
 * Admin dashboard async thunks — orchestration only; HTTP lives in dashApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Dashboard KPIs
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminDashboardStats = createAsyncThunk(
  "adminDashboard/fetchAdminDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await dashApi.getDashboardStats();
    } catch (err) {
      return rejectWithValue(
        dashApi.getApiErrorMessage(err, "Failed to load dashboard stats"),
      );
    }
  },
);
