import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierAds,
  fetchSupplierAdDetails,
  fetchSupplierAdPricing,
  createSupplierAd,
  updateSupplierAd,
  removeSupplierAd,
} from "./adsThunks";

const initialState = {
  ads: [],
  adsMeta: { page: 1, pageSize: 7, total: 0, totalPages: 1 },
  selectedAd: null,
  adsLoading: false,
  selectedAdLoading: false,
  pricing: null,
  pricingLoading: false,
  pricingError: null,
  saving: false,
  deleting: false,
  error: null,
};

const upsertAd = (state, ad) => {
  if (!ad?.id) return;
  const index = state.ads.findIndex((row) => row.id === ad.id);
  if (index >= 0) state.ads[index] = ad;
  else state.ads = [ad, ...state.ads];
  if (state.selectedAd?.id === ad.id) state.selectedAd = ad;
};

const adsSlice = createSlice({
  name: "supplierAds",
  initialState,
  reducers: {
    clearSupplierAdsError: (state) => {
      state.error = null;
    },
    clearSelectedSupplierAd: (state) => {
      state.selectedAd = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierAds.pending, (state) => {
        state.adsLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierAds.fulfilled, (state, action) => {
        state.adsLoading = false;
        state.ads = action.payload.data;
        state.adsMeta = action.payload.meta;
      })
      .addCase(fetchSupplierAds.rejected, (state, action) => {
        state.adsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierAdDetails.pending, (state) => {
        state.selectedAdLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierAdDetails.fulfilled, (state, action) => {
        state.selectedAdLoading = false;
        state.selectedAd = action.payload;
      })
      .addCase(fetchSupplierAdDetails.rejected, (state, action) => {
        state.selectedAdLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierAdPricing.pending, (state) => {
        state.pricingLoading = true;
        state.pricingError = null;
      })
      .addCase(fetchSupplierAdPricing.fulfilled, (state, action) => {
        state.pricingLoading = false;
        state.pricing = action.payload;
      })
      .addCase(fetchSupplierAdPricing.rejected, (state, action) => {
        state.pricingLoading = false;
        state.pricingError = action.payload;
      })
      .addCase(createSupplierAd.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSupplierAd.fulfilled, (state, action) => {
        state.saving = false;
        upsertAd(state, action.payload);
        if (action.payload?.id) {
          state.adsMeta = {
            ...state.adsMeta,
            total: (state.adsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createSupplierAd.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateSupplierAd.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSupplierAd.fulfilled, (state, action) => {
        state.saving = false;
        upsertAd(state, action.payload);
      })
      .addCase(updateSupplierAd.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeSupplierAd.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeSupplierAd.fulfilled, (state, action) => {
        state.deleting = false;
        state.ads = state.ads.filter((ad) => ad.id !== action.payload.adId);
        if (state.selectedAd?.id === action.payload.adId) {
          state.selectedAd = null;
        }
      })
      .addCase(removeSupplierAd.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearSupplierAdsError, clearSelectedSupplierAd } =
  adsSlice.actions;
export default adsSlice.reducer;
