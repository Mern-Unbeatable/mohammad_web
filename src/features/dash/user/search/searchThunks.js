import { createAsyncThunk } from "@reduxjs/toolkit";
import * as searchApi from "./searchApi";

/**
 * User search async thunks — orchestration only; HTTP in searchApi.
 */

export const fetchGlobalSearch = createAsyncThunk(
  "userSearch/fetchGlobalSearch",
  async ({ q = "", types, limit } = {}, { rejectWithValue }) => {
    try {
      const results = await searchApi.globalSearch({ q, types, limit });
      return { query: q, results };
    } catch (err) {
      return rejectWithValue(
        searchApi.getApiErrorMessage(err, "Failed to search"),
      );
    }
  },
);
