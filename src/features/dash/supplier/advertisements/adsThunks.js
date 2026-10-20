import { createAsyncThunk } from "@reduxjs/toolkit";
import * as adsApi from "./adsApi";

/**
 * Supplier advertisements async thunks — orchestration only; HTTP in adsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Ads list
// ═══════════════════════════════════════════════════════════════════════
export const fetchSupplierAds = createAsyncThunk(
  "supplierAds/fetchSupplierAds",
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
export const fetchSupplierAdDetails = createAsyncThunk(
  "supplierAds/fetchSupplierAdDetails",
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
// Duration pricing — refetched each time Create Ad opens so admin edits show
// ═══════════════════════════════════════════════════════════════════════
export const fetchSupplierAdPricing = createAsyncThunk(
  "supplierAds/fetchSupplierAdPricing",
  async (_, { rejectWithValue }) => {
    try {
      return await adsApi.getAdPricing();
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to load advertisement pricing"),
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().supplierAds.pricingLoading,
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Create
// ═══════════════════════════════════════════════════════════════════════
export const createSupplierAd = createAsyncThunk(
  "supplierAds/createSupplierAd",
  async (payload, { rejectWithValue }) => {
    try {
      return await adsApi.createAd(payload);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to create advertisement"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Update / resubmit
// ═══════════════════════════════════════════════════════════════════════
export const updateSupplierAd = createAsyncThunk(
  "supplierAds/updateSupplierAd",
  async ({ adId, payload }, { rejectWithValue }) => {
    try {
      return await adsApi.updateAd(adId, payload);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to update advertisement"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Delete
// ═══════════════════════════════════════════════════════════════════════
export const removeSupplierAd = createAsyncThunk(
  "supplierAds/removeSupplierAd",
  async (adId, { rejectWithValue }) => {
    try {
      return await adsApi.deleteAd(adId);
    } catch (err) {
      return rejectWithValue(
        adsApi.getApiErrorMessage(err, "Failed to delete advertisement"),
      );
    }
  },
);
