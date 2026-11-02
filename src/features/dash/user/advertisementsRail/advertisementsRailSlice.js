import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "@/features/auth/authThunks";
import { fetchAdvertisementsRail } from "./advertisementsRailThunks";

const initialState = {
  sidebarAds: [],
  feedAds: [],
  loading: false,
  loaded: false,
  fetchedAt: null,
  error: null,
};

const advertisementsRailSlice = createSlice({
  name: "userAdvertisementsRail",
  initialState,
  reducers: {
    invalidateAdvertisementsRailCache: (state) => {
      state.loaded = false;
      state.fetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvertisementsRail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvertisementsRail.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.fetchedAt = Date.now();
        state.sidebarAds = action.payload.sidebarAds;
        state.feedAds = action.payload.feedAds;
      })
      .addCase(fetchAdvertisementsRail.rejected, (state, action) => {
        state.loading = false;
        state.loaded = false;
        state.error = action.payload || "Failed to load advertisements";
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { invalidateAdvertisementsRailCache } =
  advertisementsRailSlice.actions;
export default advertisementsRailSlice.reducer;
