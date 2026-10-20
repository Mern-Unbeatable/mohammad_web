import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierJobs,
  fetchSupplierJobDetails,
  createSupplierJob,
  updateSupplierJob,
  removeSupplierJob,
} from "./recruitmentThunks";

const initialState = {
  jobs: [],
  jobsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
  selectedJob: null,
  jobsLoading: false,
  jobsRequestId: null,
  selectedJobLoading: false,
  saving: false,
  deleting: false,
  error: null,
};

const upsertJob = (state, job) => {
  if (!job?.id) return;
  const index = state.jobs.findIndex((row) => row.id === job.id);
  if (index >= 0) state.jobs[index] = job;
  if (state.selectedJob?.id === job.id) state.selectedJob = job;
};

const dropJob = (state, jobId) => {
  const before = state.jobs.length;
  state.jobs = state.jobs.filter((job) => job.id !== jobId);
  if (state.jobs.length === before) return;
  const total = Math.max(0, (state.jobsMeta.total || 0) - 1);
  const pageSize = state.jobsMeta.pageSize || 1;
  state.jobsMeta = {
    ...state.jobsMeta,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
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
    /** A job no longer matches the current list filter (e.g. after closing it). */
    jobLeftList: (state, action) => {
      dropJob(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierJobs.pending, (state, action) => {
        state.jobsLoading = true;
        state.jobsRequestId = action.meta.requestId;
        state.error = null;
        state.jobs = [];
        state.jobsMeta = {
          ...state.jobsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchSupplierJobs.fulfilled, (state, action) => {
        // Ignore responses for a section/page the user has already left.
        if (action.meta.requestId !== state.jobsRequestId) return;
        state.jobsLoading = false;
        state.jobs = action.payload.data;
        state.jobsMeta = action.payload.meta;
      })
      .addCase(fetchSupplierJobs.rejected, (state, action) => {
        if (action.meta.requestId !== state.jobsRequestId) return;
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
      .addCase(updateSupplierJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSupplierJob.fulfilled, (state, action) => {
        state.saving = false;
        upsertJob(state, action.payload);
      })
      .addCase(updateSupplierJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeSupplierJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeSupplierJob.fulfilled, (state, action) => {
        state.deleting = false;
        dropJob(state, action.payload.jobId);
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

export const {
  clearRecruitmentError,
  clearSelectedJob,
  invalidateJobsList,
  jobLeftList,
} = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
