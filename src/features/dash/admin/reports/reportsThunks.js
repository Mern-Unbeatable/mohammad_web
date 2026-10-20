import { createAsyncThunk } from "@reduxjs/toolkit";
import * as reportsApi from "./reportsApi";

/**
 * Admin reports async thunks — orchestration only; HTTP in reportsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Reports list
// ═══════════════════════════════════════════════════════════════════════
export const fetchReportsList = createAsyncThunk(
  "adminReports/fetchReportsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getReportsList(params);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to load reports"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Report stats
// ═══════════════════════════════════════════════════════════════════════
export const fetchReportStats = createAsyncThunk(
  "adminReports/fetchReportStats",
  async (_, { rejectWithValue }) => {
    try {
      return await reportsApi.getReportStats();
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to load report stats"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Report details
// ═══════════════════════════════════════════════════════════════════════
export const fetchReportDetails = createAsyncThunk(
  "adminReports/fetchReportDetails",
  async (reportId, { rejectWithValue }) => {
    try {
      return await reportsApi.getReportById(reportId);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to load report details"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Update status
// ═══════════════════════════════════════════════════════════════════════
export const updateReportStatus = createAsyncThunk(
  "adminReports/updateReportStatus",
  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      return await reportsApi.patchReportStatus(reportId, status);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to update report status"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Moderate
// ═══════════════════════════════════════════════════════════════════════
export const moderateReport = createAsyncThunk(
  "adminReports/moderateReport",
  async ({ reportId, action, note }, { rejectWithValue }) => {
    try {
      return await reportsApi.postModerate(reportId, action, note);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to moderate report"),
      );
    }
  },
);
