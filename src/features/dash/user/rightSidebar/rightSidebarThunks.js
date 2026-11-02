import { createAsyncThunk } from "@reduxjs/toolkit";
import { contactsApi, requestContactConnection } from "@/features/dash/user/contacts";
import { marketplaceApi } from "@/features/dash/user/marketplace";
import { recruitmentApi } from "@/features/dash/user/recruitment";
import { PEOPLE_FETCH_SIZE, SIDEBAR_LIMIT } from "@/components/navigation/constant/constants";
import {
  toSidebarJobs,
  toSidebarListings,
  toSuggestedPeople,
} from "@/shared/utils/nav/sidebarModels";

export const SIDEBAR_CACHE_TTL_MS = 10 * 60 * 1000;

const isFresh = (fetchedAt) =>
  Boolean(fetchedAt) && Date.now() - fetchedAt < SIDEBAR_CACHE_TTL_MS;

export const fetchSidebarPeople = createAsyncThunk(
  "userRightSidebar/fetchSidebarPeople",
  async (_, { rejectWithValue }) => {
    try {
      const result = await contactsApi.getContactsList({
        page: 1,
        pageSize: PEOPLE_FETCH_SIZE,
        sort: "desc",
      });
      return toSuggestedPeople(result.data);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load suggestions"),
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().userRightSidebar;
      if (state.peopleLoading) return false;
      if (arg?.force) return true;
      if (state.peopleLoaded && isFresh(state.peopleFetchedAt)) return false;
      return true;
    },
  },
);

export const fetchSidebarListings = createAsyncThunk(
  "userRightSidebar/fetchSidebarListings",
  async (_, { rejectWithValue }) => {
    try {
      const result = await marketplaceApi.getListingsList({
        page: 1,
        pageSize: SIDEBAR_LIMIT,
        sort: "desc",
      });
      return toSidebarListings(result.data);
    } catch (err) {
      return rejectWithValue(
        marketplaceApi.getApiErrorMessage(err, "Failed to load marketplace"),
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().userRightSidebar;
      if (state.listingsLoading) return false;
      if (arg?.force) return true;
      if (state.listingsLoaded && isFresh(state.listingsFetchedAt)) return false;
      return true;
    },
  },
);

export const fetchSidebarJobs = createAsyncThunk(
  "userRightSidebar/fetchSidebarJobs",
  async (_, { rejectWithValue }) => {
    try {
      const result = await recruitmentApi.getJobsList({
        page: 1,
        pageSize: SIDEBAR_LIMIT,
        sort: "desc",
      });
      return toSidebarJobs(result.data);
    } catch (err) {
      return rejectWithValue(
        recruitmentApi.getApiErrorMessage(err, "Failed to load jobs"),
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState().userRightSidebar;
      if (state.jobsLoading) return false;
      if (arg?.force) return true;
      if (state.jobsLoaded && isFresh(state.jobsFetchedAt)) return false;
      return true;
    },
  },
);

export const refreshRightSidebar = createAsyncThunk(
  "userRightSidebar/refreshRightSidebar",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchSidebarPeople({ force: true })).unwrap().catch(() => null),
      dispatch(fetchSidebarListings({ force: true })).unwrap().catch(() => null),
      dispatch(fetchSidebarJobs({ force: true })).unwrap().catch(() => null),
    ]);
    return true;
  },
);

export { requestContactConnection };
