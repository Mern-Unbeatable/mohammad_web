import { createAsyncThunk } from "@reduxjs/toolkit";
import * as adsApi from "./adsApi";

/**
 * Admin advertisements async thunks — orchestration only; HTTP in adsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Ads list
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdsList = createAsyncThunk(
  "adminAds/fetchAdsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await adsApi.getAdsList(params);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to load advertisements"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Ad details
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdDetails = createAsyncThunk(
  "adminAds/fetchAdDetails",
  async (adId, { rejectWithValue }) => {
    try {
      return await adsApi.getAdById(adId);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to load advertisement"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Review
// ═══════════════════════════════════════════════════════════════════════
export const reviewAdvertisement = createAsyncThunk(
  "adminAds/reviewAdvertisement",
  async ({ adId, status, rejectionReason }, { rejectWithValue }) => {
    try {
      return await adsApi.reviewAd(adId, status, rejectionReason);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to review advertisement"),
      );
    }
  },
);
