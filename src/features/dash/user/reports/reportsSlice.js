import { createSlice } from "@reduxjs/toolkit";
import { createReport, fetchMyReports } from "./reportsThunks";

const initialState = {
  reports: [],
  reportsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  reportsLoading: false,
  submitting: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "userReports",
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReports.pending, (state) => {
        state.reportsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload.data;
        state.reportsMeta = action.payload.meta;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.error = action.payload;
      })
      .addCase(createReport.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload?.id) {
          state.reports = [action.payload, ...state.reports];
          state.reportsMeta = {
            ...state.reportsMeta,
            total: (state.reportsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;
