import { createAsyncThunk } from "@reduxjs/toolkit";
import * as statsApi from "./statsApi";

/**
 * Admin statistics async thunks — orchestration only; HTTP in statsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Annual chart series
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminStatistics = createAsyncThunk(
  "adminStatistics/fetchAdminStatistics",
  async (yearArg, { rejectWithValue }) => {
    try {
      return await statsApi.getStatistics(yearArg);
    } catch (err) {
      return rejectWithValue(
        statsApi.getApiErrorMessage(
          err,
          "Failed to load statistics chart data",
        ),
      );
    }
  },
);
