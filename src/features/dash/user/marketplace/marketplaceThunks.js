import { createAsyncThunk } from "@reduxjs/toolkit";
import * as marketplaceApi from "./marketplaceApi";

/**
 * User marketplace async thunks — orchestration only; HTTP in marketplaceApi.
 */

export const fetchListings = createAsyncThunk(
  "userMarketplace/fetchListings",
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

export const fetchListingDetails = createAsyncThunk(
  "userMarketplace/fetchListingDetails",
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

export const createListing = createAsyncThunk(
  "userMarketplace/createListing",
  async (payload, { rejectWithValue }) => {
    try {
      return await marketplaceApi.createListing(payload);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to create listing"),
      );
    }
  },
);

export const updateListing = createAsyncThunk(
  "userMarketplace/updateListing",
  async ({ listingId, payload }, { rejectWithValue }) => {
    try {
      return await marketplaceApi.updateListing(listingId, payload);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to update listing"),
      );
    }
  },
);

export const removeListing = createAsyncThunk(
  "userMarketplace/removeListing",
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

export const toggleSaveListing = createAsyncThunk(
  "userMarketplace/toggleSaveListing",
  async (listingId, { rejectWithValue }) => {
    try {
      return await marketplaceApi.toggleSaveListing(listingId);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to update saved listing"),
      );
    }
  },
);

export const enquireListing = createAsyncThunk(
  "userMarketplace/enquireListing",
  async ({ listingId, message }, { rejectWithValue }) => {
    try {
      const data = await marketplaceApi.enquireListing(listingId, message);
      return { listingId, data };
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to send enquiry"),
      );
    }
  },
);
