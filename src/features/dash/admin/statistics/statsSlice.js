import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminStatistics } from "./statsThunks";

const initialState = {
  statistics: null,
  statisticsLoading: false,
  statisticsError: null,
  error: null,
};

const statsSlice = createSlice({
  name: "adminStatistics",
  initialState,
  reducers: {
    clearStatisticsError: (state) => {
      state.error = null;
      state.statisticsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
        state.error = null;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
        state.statisticsError = null;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = null;
        state.statisticsError = action.payload;
        state.error = action.payload;
      });
  },
});

export const { clearStatisticsError } = statsSlice.actions;
export default statsSlice.reducer;
