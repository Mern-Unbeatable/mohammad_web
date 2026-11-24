import { createAsyncThunk } from "@reduxjs/toolkit";
import * as recruitmentApi from "./recruitmentApi";

/**
 * Admin recruitment async thunks — orchestration only; HTTP in recruitmentApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Jobs list
// ═══════════════════════════════════════════════════════════════════════
export const fetchJobsList = createAsyncThunk(
  "adminRecruitment/fetchJobsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getJobsList(params);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load jobs list"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Job details
// ═══════════════════════════════════════════════════════════════════════
export const fetchJobDetails = createAsyncThunk(
  "adminRecruitment/fetchJobDetails",
  async (jobId, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getJobById(jobId);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load job details"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Delete job
// ═══════════════════════════════════════════════════════════════════════
export const removeJob = createAsyncThunk(
  "adminRecruitment/removeJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await recruitmentApi.deleteJob(jobId);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to delete job"),
      );
    }
  },
);
