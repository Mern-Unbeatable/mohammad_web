import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReportsList,
  fetchReportStats,
  fetchReportDetails,
  updateReportStatus,
  moderateReport,
} from "./reportsThunks";

const initialState = {
  reports: [],
  reportsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  stats: null,
  selectedReport: null,
  reportsLoading: false,
  statsLoading: false,
  selectedReportLoading: false,
  actionLoading: false,
  error: null,
};

const upsertReport = (state, report) => {
  if (!report?.id) return;
  const index = state.reports.findIndex((row) => row.id === report.id);
  if (index >= 0) state.reports[index] = report;
  if (state.selectedReport?.id === report.id) {
    state.selectedReport = report;
  }
};

const reportsSlice = createSlice({
  name: "adminReports",
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsList.pending, (state) => {
        state.reportsLoading = true;
        state.error = null;
      })
      .addCase(fetchReportsList.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload.data;
        state.reportsMeta = action.payload.meta;
      })
      .addCase(fetchReportsList.rejected, (state, action) => {
        state.reportsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReportStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchReportStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchReportStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReportDetails.pending, (state) => {
        state.selectedReportLoading = true;
        state.error = null;
      })
      .addCase(fetchReportDetails.fulfilled, (state, action) => {
        state.selectedReportLoading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportDetails.rejected, (state, action) => {
        state.selectedReportLoading = false;
        state.error = action.payload;
      })
      .addCase(updateReportStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertReport(state, action.payload);
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(moderateReport.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(moderateReport.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertReport(state, action.payload);
      })
      .addCase(moderateReport.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportsError, clearSelectedReport } = reportsSlice.actions;
export default reportsSlice.reducer;
