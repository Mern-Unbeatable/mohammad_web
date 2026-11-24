import { createAsyncThunk } from "@reduxjs/toolkit";
import * as marketplaceApi from "./marketplaceApi";

/**
 * Admin marketplace async thunks — orchestration only; HTTP in marketplaceApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Listings list
// ═══════════════════════════════════════════════════════════════════════
export const fetchListingsList = createAsyncThunk(
  "adminMarketplace/fetchListingsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await marketplaceApi.getListingsList(params);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to load listings"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Listing details
// ═══════════════════════════════════════════════════════════════════════
export const fetchListingDetails = createAsyncThunk(
  "adminMarketplace/fetchListingDetails",
  async (listingId, { rejectWithValue }) => {
    try {
      return await marketplaceApi.getListingById(listingId);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to load listing"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Delete listing
// ═══════════════════════════════════════════════════════════════════════
export const removeListing = createAsyncThunk(
  "adminMarketplace/removeListing",
  async (listingId, { rejectWithValue }) => {
    try {
      return await marketplaceApi.deleteListing(listingId);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to delete listing"),
      );
    }
  },
);
