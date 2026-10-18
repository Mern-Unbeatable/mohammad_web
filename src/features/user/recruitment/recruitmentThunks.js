import { createAsyncThunk } from "@reduxjs/toolkit";
import * as recruitmentApi from "./recruitmentApi";

/**
 * User recruitment async thunks — orchestration only; HTTP in recruitmentApi.
 */

export const fetchJobs = createAsyncThunk(
  "userRecruitment/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getJobsList(params);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load jobs"),
      );
    }
  },
);

export const fetchJobDetails = createAsyncThunk(
  "userRecruitment/fetchJobDetails",
  async (jobId, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getJobById(jobId);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load job details"),
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "userRecruitment/createJob",
  async (payload, { rejectWithValue }) => {
    try {
      return await recruitmentApi.createJob(payload);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to publish job"),
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "userRecruitment/updateJob",
  async ({ jobId, payload }, { rejectWithValue }) => {
    try {
      return await recruitmentApi.updateJob(jobId, payload);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to update job"),
      );
    }
  },
);

export const removeJob = createAsyncThunk(
  "userRecruitment/removeJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await recruitmentApi.deleteJob(jobId);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to delete job"),
      );
    }
  },
);

export const applyToJob = createAsyncThunk(
  "userRecruitment/applyToJob",
  async ({ jobId, coverLetter }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (coverLetter != null) payload.coverLetter = coverLetter;
      const application = await recruitmentApi.applyToJob(jobId, payload);
      return { jobId, application };
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to apply to job"),
      );
    }
  },
);

export const fetchNewApplicationCounts = createAsyncThunk(
  "userRecruitment/fetchNewApplicationCounts",
  async (_arg, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getNewApplicationCounts();
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load new applications"),
      );
    }
  },
);

export const fetchMyApplications = createAsyncThunk(
  "userRecruitment/fetchMyApplications",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await recruitmentApi.getMyApplications(params);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load applications"),
      );
    }
  },
);
