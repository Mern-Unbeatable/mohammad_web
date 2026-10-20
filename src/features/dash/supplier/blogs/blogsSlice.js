import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierBlogs,
  fetchSupplierLatestBlogs,
  fetchSupplierBlogBySlug,
} from "./blogsThunks";

const initialState = {
  blogs: [],
  blogsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  latestBlogs: [],
  selectedBlog: null,
  blogsLoading: false,
  latestLoading: false,
  selectedBlogLoading: false,
  error: null,
};

const blogsSlice = createSlice({
  name: "supplierBlogs",
  initialState,
  reducers: {
    clearBlogsError: (state) => {
      state.error = null;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierBlogs.pending, (state) => {
        state.blogsLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierBlogs.fulfilled, (state, action) => {
        state.blogsLoading = false;
        state.blogs = action.payload.data;
        state.blogsMeta = action.payload.meta;
      })
      .addCase(fetchSupplierBlogs.rejected, (state, action) => {
        state.blogsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierLatestBlogs.pending, (state) => {
        state.latestLoading = true;
      })
      .addCase(fetchSupplierLatestBlogs.fulfilled, (state, action) => {
        state.latestLoading = false;
        state.latestBlogs = action.payload.data;
      })
      .addCase(fetchSupplierLatestBlogs.rejected, (state, action) => {
        state.latestLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierBlogBySlug.pending, (state) => {
        state.selectedBlogLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierBlogBySlug.fulfilled, (state, action) => {
        state.selectedBlogLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchSupplierBlogBySlug.rejected, (state, action) => {
        state.selectedBlogLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogsError, clearSelectedBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
