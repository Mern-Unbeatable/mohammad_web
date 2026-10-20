import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListings,
  fetchListingDetails,
  createListing,
  updateListing,
  removeListing,
  toggleSaveListing,
  enquireListing,
} from "./marketplaceThunks";

const initialState = {
  listings: [],
  listingsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedListing: null,
  listingsLoading: false,
  listingsRequestId: null,
  listingsError: null,
  selectedListingLoading: false,
  saving: false,
  deleting: false,
  savingId: null,
  enquiring: false,
  error: null,
};

const upsertListing = (state, listing) => {
  if (!listing?.id) return;
  const index = state.listings.findIndex((row) => row.id === listing.id);
  if (index >= 0) state.listings[index] = listing;
  else state.listings = [listing, ...state.listings];
  if (state.selectedListing?.id === listing.id) {
    state.selectedListing = listing;
  }
};

const marketplaceSlice = createSlice({
  name: "userMarketplace",
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
      .addCase(fetchListings.pending, (state, action) => {
        state.listingsLoading = true;
        state.listingsRequestId = action.meta.requestId;
        state.error = null;
        state.listingsError = null;
        state.listings = [];
        state.listingsMeta = {
          ...state.listingsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        // Ignore responses for a page/filter the user has already left.
        if (action.meta.requestId !== state.listingsRequestId) return;
        state.listingsLoading = false;
        state.listings = action.payload.data;
        state.listingsMeta = action.payload.meta;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        if (action.meta.requestId !== state.listingsRequestId) return;
        state.listingsLoading = false;
        state.error = action.payload;
        state.listingsError = action.payload || "Failed to load listings";
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
      .addCase(createListing.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.saving = false;
        upsertListing(state, action.payload);
        if (action.payload?.id) {
          state.listingsMeta = {
            ...state.listingsMeta,
            total: (state.listingsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createListing.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateListing.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.saving = false;
        upsertListing(state, action.payload);
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.saving = false;
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
      })
      .addCase(toggleSaveListing.pending, (state, action) => {
        state.savingId = action.meta.arg;
        state.error = null;
      })
      .addCase(toggleSaveListing.fulfilled, (state, action) => {
        state.savingId = null;
        const { listingId, isSaved } = action.payload;
        state.listings = state.listings.map((item) =>
          item.id === listingId ? { ...item, isSaved, saved: isSaved } : item,
        );
        if (state.selectedListing?.id === listingId) {
          state.selectedListing = {
            ...state.selectedListing,
            isSaved,
            saved: isSaved,
          };
        }
      })
      .addCase(toggleSaveListing.rejected, (state, action) => {
        state.savingId = null;
        state.error = action.payload;
      })
      .addCase(enquireListing.pending, (state) => {
        state.enquiring = true;
        state.error = null;
      })
      .addCase(enquireListing.fulfilled, (state) => {
        state.enquiring = false;
      })
      .addCase(enquireListing.rejected, (state, action) => {
        state.enquiring = false;
        state.error = action.payload;
      });
  },
});

export const { clearMarketplaceError, clearSelectedListing } =
  marketplaceSlice.actions;
export default marketplaceSlice.reducer;
