import { createAsyncThunk } from "@reduxjs/toolkit";
import * as recruitmentApi from "./recruitmentApi";

/**
 * Supplier recruitment async thunks — orchestration only; HTTP in recruitmentApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Browse / my jobs list
// ═══════════════════════════════════════════════════════════════════════
export const fetchSupplierJobs = createAsyncThunk(
  "supplierRecruitment/fetchSupplierJobs",
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

// ═══════════════════════════════════════════════════════════════════════
// Job details
// ═══════════════════════════════════════════════════════════════════════
export const fetchSupplierJobDetails = createAsyncThunk(
  "supplierRecruitment/fetchSupplierJobDetails",
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

// ═══════════════════════════════════════════════════════════════════════
// Create job
// ═══════════════════════════════════════════════════════════════════════
export const createSupplierJob = createAsyncThunk(
  "supplierRecruitment/createSupplierJob",
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

// ═══════════════════════════════════════════════════════════════════════
// Delete job
// ═══════════════════════════════════════════════════════════════════════
export const updateSupplierJob = createAsyncThunk(
  "supplierRecruitment/updateSupplierJob",
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

export const removeSupplierJob = createAsyncThunk(
  "supplierRecruitment/removeSupplierJob",
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

export const applyToSupplierJob = createAsyncThunk(
  "supplierRecruitment/applyToSupplierJob",
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

export const withdrawSupplierApplication = createAsyncThunk(
  "supplierRecruitment/withdrawSupplierApplication",
  async (jobId, { rejectWithValue }) => {
    try {
      await recruitmentApi.withdrawApplication(jobId);
      return { jobId };
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to cancel application"),
      );
    }
  },
);

export const fetchSupplierNewApplicationCounts = createAsyncThunk(
  "supplierRecruitment/fetchSupplierNewApplicationCounts",
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

export const fetchSupplierMyApplications = createAsyncThunk(
  "supplierRecruitment/fetchSupplierMyApplications",
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
