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
