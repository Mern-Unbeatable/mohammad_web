import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboardStats } from "./dashThunks";

const initialState = {
  stats: [],
  attention: { reports: [], ads: [] },
  snapshot: {
    newSubscribers: 0,
    newJobs: 0,
    totalListings: 0,
    pendingReports: 0,
    pendingAds: 0,
  },
  loading: false,
  statsError: null,
  error: null,
};

const dashSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.loading = true;
        state.statsError = null;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.stats || [];
        state.attention = action.payload?.attention || initialState.attention;
        state.snapshot = action.payload?.snapshot || initialState.snapshot;
        state.statsError = null;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.stats = [];
        state.attention = initialState.attention;
        state.snapshot = initialState.snapshot;
        state.statsError = action.payload;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = dashSlice.actions;
export default dashSlice.reducer;
