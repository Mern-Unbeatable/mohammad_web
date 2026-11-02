import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "@/features/auth/authThunks";
import {
  fetchSidebarPeople,
  fetchSidebarListings,
  fetchSidebarJobs,
} from "./rightSidebarThunks";

const initialState = {
  people: [],
  listings: [],
  jobs: [],
  peopleLoading: false,
  listingsLoading: false,
  jobsLoading: false,
  peopleLoaded: false,
  listingsLoaded: false,
  jobsLoaded: false,
  peopleFetchedAt: null,
  listingsFetchedAt: null,
  jobsFetchedAt: null,
  peopleError: null,
  listingsError: null,
  jobsError: null,
};

const rightSidebarSlice = createSlice({
  name: "userRightSidebar",
  initialState,
  reducers: {
    invalidateRightSidebarCache: (state) => {
      state.peopleLoaded = false;
      state.listingsLoaded = false;
      state.jobsLoaded = false;
      state.peopleFetchedAt = null;
      state.listingsFetchedAt = null;
      state.jobsFetchedAt = null;
    },
    markSidebarPersonPending: (state, action) => {
      state.people = state.people.map((row) =>
        row.id === action.payload ? { ...row, pending: true } : row,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarPeople.pending, (state) => {
        state.peopleLoading = true;
        state.peopleError = null;
      })
      .addCase(fetchSidebarPeople.fulfilled, (state, action) => {
        state.peopleLoading = false;
        state.peopleLoaded = true;
        state.peopleFetchedAt = Date.now();
        state.people = action.payload;
      })
      .addCase(fetchSidebarPeople.rejected, (state, action) => {
        state.peopleLoading = false;
        state.peopleLoaded = false;
        state.peopleError = action.payload || "Failed to load suggestions";
      })
      .addCase(fetchSidebarListings.pending, (state) => {
        state.listingsLoading = true;
        state.listingsError = null;
      })
      .addCase(fetchSidebarListings.fulfilled, (state, action) => {
        state.listingsLoading = false;
        state.listingsLoaded = true;
        state.listingsFetchedAt = Date.now();
        state.listings = action.payload;
      })
      .addCase(fetchSidebarListings.rejected, (state, action) => {
        state.listingsLoading = false;
        state.listingsLoaded = false;
        state.listingsError = action.payload || "Failed to load marketplace";
      })
      .addCase(fetchSidebarJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchSidebarJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobsLoaded = true;
        state.jobsFetchedAt = Date.now();
        state.jobs = action.payload;
      })
      .addCase(fetchSidebarJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsLoaded = false;
        state.jobsError = action.payload || "Failed to load jobs";
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { invalidateRightSidebarCache, markSidebarPersonPending } =
  rightSidebarSlice.actions;
export default rightSidebarSlice.reducer;
