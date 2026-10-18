import { createSlice } from "@reduxjs/toolkit";
import {
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  removeJob,
  applyToJob,
  fetchMyApplications,
  fetchNewApplicationCounts,
  withdrawApplication,
} from "./recruitmentThunks";

const initialState = {
  jobs: [],
  jobsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
  selectedJob: null,
  applications: [],
  applicationsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  jobsLoading: true,
  jobsRequestId: null,
  jobsError: null,
  selectedJobLoading: false,
  applicationsLoading: false,
  saving: false,
  deleting: false,
  applying: false,
  error: null,
  /** Unseen applications on my jobs, for nav / card badges. */
  newApplications: { total: 0, byJob: {} },
};

const upsertJob = (state, job) => {
  if (!job?.id) return;
  const index = state.jobs.findIndex((row) => row.id === job.id);
  if (index >= 0) state.jobs[index] = job;
  else state.jobs = [job, ...state.jobs];
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
  name: "userRecruitment",
  initialState,
  reducers: {
    clearRecruitmentError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    /** Sync: show job skeletons before paint when filter/page/search changes */
    invalidateJobsList: (state) => {
      state.jobsLoading = true;
      state.jobs = [];
      state.jobsMeta = {
        ...state.jobsMeta,
        total: 0,
        totalPages: 1,
      };
      state.error = null;
      state.jobsError = null;
    },
    /** A job no longer matches the current list filter (e.g. after closing it). */
    jobLeftList: (state, action) => {
      dropJob(state, action.payload);
    },
    /** The owner opened a job's applicants; the server marks them seen too. */
    jobApplicationsSeen: (state, action) => {
      const { byJob, total } = state.newApplications;
      const seen = byJob[action.payload] || 0;
      if (!seen) return;
      delete byJob[action.payload];
      state.newApplications.total = Math.max(0, total - seen);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state, action) => {
        state.jobsLoading = true;
        state.jobsRequestId = action.meta.requestId;
        state.error = null;
        state.jobsError = null;
        state.jobs = [];
        state.jobsMeta = {
          ...state.jobsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        // Ignore responses for a page/filter the user has already left.
        if (action.meta.requestId !== state.jobsRequestId) return;
        state.jobsLoading = false;
        state.jobs = action.payload.data;
        state.jobsMeta = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        if (action.meta.requestId !== state.jobsRequestId) return;
        state.jobsLoading = false;
        state.error = action.payload;
        state.jobsError = action.payload || "Failed to load jobs";
      })
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
      .addCase(createJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.saving = false;
        upsertJob(state, action.payload);
        if (action.payload?.id) {
          state.jobsMeta = {
            ...state.jobsMeta,
            total: (state.jobsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.saving = false;
        upsertJob(state, action.payload);
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        state.deleting = false;
        dropJob(state, action.payload.jobId);
        if (state.selectedJob?.id === action.payload.jobId) {
          state.selectedJob = null;
        }
      })
      .addCase(removeJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(applyToJob.pending, (state) => {
        state.applying = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applying = false;
        const application = action.payload?.application;
        if (application) {
          state.applications = [application, ...state.applications];
        }
        if (state.selectedJob?.id === action.payload?.jobId) {
          state.selectedJob.myApplication = {
            id: application?.id ?? null,
            status: application?.status ?? "APPLIED",
            appliedAt: application?.createdAt ?? new Date().toISOString(),
          };
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.applying = false;
        state.error = action.payload;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload.data;
        state.applicationsMeta = action.payload.meta;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.error = action.payload;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        state.applications = state.applications.filter(
          (app) => (app.job?.id || app.jobId) !== jobId,
        );
        if (state.selectedJob?.id === jobId) {
          state.selectedJob.myApplication = null;
        }
      })
      .addCase(fetchNewApplicationCounts.fulfilled, (state, action) => {
        state.newApplications = action.payload;
      });
  },
});

export const selectNewApplicationTotal = (state) =>
  state.userRecruitment.newApplications.total;
export const selectNewApplicationsByJob = (state) =>
  state.userRecruitment.newApplications.byJob;

export const {
  clearRecruitmentError,
  clearSelectedJob,
  invalidateJobsList,
  jobLeftList,
  jobApplicationsSeen,
} = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
