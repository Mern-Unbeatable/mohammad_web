import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboardStats } from "./dashThunks";

const initialState = {
  stats: [],
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
        state.stats = action.payload;
        state.statsError = null;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.stats = [];
        state.statsError = action.payload;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = dashSlice.actions;
export default dashSlice.reducer;
