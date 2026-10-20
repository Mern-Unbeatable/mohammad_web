import { createAsyncThunk } from "@reduxjs/toolkit";
import * as reportsApi from "./reportsApi";

/**
 * User reports async thunks — orchestration only; HTTP in reportsApi.
 */

export const createReport = createAsyncThunk(
  "userReports/createReport",
  async (payload, { rejectWithValue }) => {
    try {
      return await reportsApi.createReport(payload);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to submit report"),
      );
    }
  },
);

export const fetchMyReports = createAsyncThunk(
  "userReports/fetchMyReports",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reportsApi.getMyReports(params);
    } catch (err) {
      return rejectWithValue(
        reportsApi.getApiErrorMessage(err, "Failed to load reports"),
      );
    }
  },
);
