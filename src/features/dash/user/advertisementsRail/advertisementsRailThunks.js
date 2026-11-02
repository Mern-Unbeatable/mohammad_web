import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/config/client";

const SIDEBAR_AD_LIMIT = 3;
export const ADS_RAIL_CACHE_TTL_MS = 10 * 60 * 1000;

const isFresh = (fetchedAt) =>
  Boolean(fetchedAt) && Date.now() - fetchedAt < ADS_RAIL_CACHE_TTL_MS;

export const fetchAdvertisementsRail = createAsyncThunk(
  "userAdvertisementsRail/fetchAdvertisementsRail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/feed/ads/active", {
        params: { page: 1, pageSize: 100 },
      });
      const allAds = Array.isArray(response.data) ? response.data : [];
      return {
        sidebarAds: allAds.slice(0, SIDEBAR_AD_LIMIT),
        feedAds: allAds.slice(SIDEBAR_AD_LIMIT),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load advertisements",
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().userAdvertisementsRail;
      if (state.loading) return false;
      if (arg?.force) return true;
      if (state.loaded && isFresh(state.fetchedAt)) return false;
      return true;
    },
  },
);
