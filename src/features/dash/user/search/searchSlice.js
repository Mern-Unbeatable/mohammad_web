import { createSlice } from "@reduxjs/toolkit";
import { fetchGlobalSearch } from "./searchThunks";

const initialState = {
  results: null,
  query: "",
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    clearSearchError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.results = null;
      state.query = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalSearch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg?.q || "";
      })
      .addCase(fetchGlobalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        state.results = action.payload.results;
      })
      .addCase(fetchGlobalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchError, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
