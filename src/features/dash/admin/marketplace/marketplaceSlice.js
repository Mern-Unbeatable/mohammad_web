import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListingsList,
  fetchListingDetails,
  removeListing,
} from "./marketplaceThunks";

const initialState = {
  listings: [],
  listingsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedListing: null,
  listingsLoading: false,
  selectedListingLoading: false,
  deleting: false,
  error: null,
};

const marketplaceSlice = createSlice({
  name: "adminMarketplace",
  initialState,
  reducers: {
    clearMarketplaceError: (state) => {
      state.error = null;
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingsList.pending, (state) => {
        state.listingsLoading = true;
        state.error = null;
      })
      .addCase(fetchListingsList.fulfilled, (state, action) => {
        state.listingsLoading = false;
        state.listings = action.payload.data;
        state.listingsMeta = action.payload.meta;
      })
      .addCase(fetchListingsList.rejected, (state, action) => {
        state.listingsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchListingDetails.pending, (state) => {
        state.selectedListingLoading = true;
        state.error = null;
      })
      .addCase(fetchListingDetails.fulfilled, (state, action) => {
        state.selectedListingLoading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingDetails.rejected, (state, action) => {
        state.selectedListingLoading = false;
        state.error = action.payload;
      })
      .addCase(removeListing.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeListing.fulfilled, (state, action) => {
        state.deleting = false;
        const { listingId } = action.payload;
        state.listings = state.listings.filter((item) => item.id !== listingId);
        if (state.selectedListing?.id === listingId) {
          state.selectedListing = null;
        }
      })
      .addCase(removeListing.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearMarketplaceError, clearSelectedListing } =
  marketplaceSlice.actions;
export default marketplaceSlice.reducer;
