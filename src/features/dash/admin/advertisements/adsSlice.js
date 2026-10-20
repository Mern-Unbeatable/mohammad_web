import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdsList,
  fetchAdDetails,
  reviewAdvertisement,
} from "./adsThunks";

const initialState = {
  ads: [],
  adsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedAd: null,
  adsLoading: false,
  selectedAdLoading: false,
  actionLoading: false,
  error: null,
};

const upsertAd = (state, ad) => {
  if (!ad?.id) return;
  const index = state.ads.findIndex((row) => row.id === ad.id);
  if (index >= 0) state.ads[index] = ad;
  if (state.selectedAd?.id === ad.id) {
    state.selectedAd = ad;
  }
};

const adsSlice = createSlice({
  name: "adminAds",
  initialState,
  reducers: {
    clearAdsError: (state) => {
      state.error = null;
    },
    clearSelectedAd: (state) => {
      state.selectedAd = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdsList.pending, (state) => {
        state.adsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdsList.fulfilled, (state, action) => {
        state.adsLoading = false;
        state.ads = action.payload.data;
        state.adsMeta = action.payload.meta;
      })
      .addCase(fetchAdsList.rejected, (state, action) => {
        state.adsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdDetails.pending, (state) => {
        state.selectedAdLoading = true;
        state.error = null;
      })
      .addCase(fetchAdDetails.fulfilled, (state, action) => {
        state.selectedAdLoading = false;
        state.selectedAd = action.payload;
      })
      .addCase(fetchAdDetails.rejected, (state, action) => {
        state.selectedAdLoading = false;
        state.error = action.payload;
      })
      .addCase(reviewAdvertisement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(reviewAdvertisement.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertAd(state, action.payload);
      })
      .addCase(reviewAdvertisement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdsError, clearSelectedAd } = adsSlice.actions;
export default adsSlice.reducer;
