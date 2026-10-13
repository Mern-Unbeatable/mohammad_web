import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierJobs,
  fetchSupplierJobDetails,
  createSupplierJob,
  removeSupplierJob,
} from "./recruitmentThunks";

const initialState = {
  jobs: [],
  jobsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
  selectedJob: null,
  jobsLoading: false,
  selectedJobLoading: false,
  saving: false,
  deleting: false,
  error: null,
};

const recruitmentSlice = createSlice({
  name: "supplierRecruitment",
  initialState,
  reducers: {
    clearRecruitmentError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    /** Sync: show job skeletons before paint when filter/search changes */
    invalidateJobsList: (state) => {
      state.jobsLoading = true;
      state.jobs = [];
      state.jobsMeta = {
        ...state.jobsMeta,
        total: 0,
        totalPages: 1,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierJobs.pending, (state) => {
        state.jobsLoading = true;
        state.error = null;
        state.jobs = [];
        state.jobsMeta = {
          ...state.jobsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchSupplierJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload.data;
        state.jobsMeta = action.payload.meta;
      })
      .addCase(fetchSupplierJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierJobDetails.pending, (state) => {
        state.selectedJobLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierJobDetails.fulfilled, (state, action) => {
        state.selectedJobLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchSupplierJobDetails.rejected, (state, action) => {
        state.selectedJobLoading = false;
        state.error = action.payload;
      })
      .addCase(createSupplierJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSupplierJob.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.id) {
          state.jobs = [action.payload, ...state.jobs];
        }
      })
      .addCase(createSupplierJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeSupplierJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeSupplierJob.fulfilled, (state, action) => {
        state.deleting = false;
        state.jobs = state.jobs.filter(
          (job) => job.id !== action.payload.jobId,
        );
        if (state.selectedJob?.id === action.payload.jobId) {
          state.selectedJob = null;
        }
      })
      .addCase(removeSupplierJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecruitmentError, clearSelectedJob, invalidateJobsList } =
  recruitmentSlice.actions;
export default recruitmentSlice.reducer;
