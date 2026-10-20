import { createSlice } from "@reduxjs/toolkit";
import {
  fetchJobsList,
  fetchJobDetails,
  removeJob,
} from "./recruitmentThunks";

const initialState = {
  jobs: [],
  jobsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedJob: null,
  jobsLoading: false,
  selectedJobLoading: false,
  deleting: false,
  error: null,
};

const recruitmentSlice = createSlice({
  name: "adminRecruitment",
  initialState,
  reducers: {
    clearRecruitmentError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Jobs list
      .addCase(fetchJobsList.pending, (state) => {
        state.jobsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsList.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload.data;
        state.jobsMeta = action.payload.meta;
      })
      .addCase(fetchJobsList.rejected, (state, action) => {
        state.jobsLoading = false;
        state.error = action.payload;
      })
      // Job detail
      .addCase(fetchJobDetails.pending, (state) => {
        state.selectedJobLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.selectedJobLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.selectedJobLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(removeJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        state.deleting = false;
        const { jobId } = action.payload;
        state.jobs = state.jobs.filter((job) => job.id !== jobId);
        if (state.selectedJob?.id === jobId) {
          state.selectedJob = null;
        }
      })
      .addCase(removeJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecruitmentError, clearSelectedJob } =
  recruitmentSlice.actions;
export default recruitmentSlice.reducer;
