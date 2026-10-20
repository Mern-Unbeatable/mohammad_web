import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogsList,
  createBlogPost,
  updateBlogPost,
  removeBlogPost,
} from "./blogsThunks";

const initialState = {
  blogs: [],
  blogsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  blogsLoading: false,
  saving: false,
  deleting: false,
  error: null,
};

const blogsSlice = createSlice({
  name: "adminBlogs",
  initialState,
  reducers: {
    clearBlogsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogsList.pending, (state) => {
        state.blogsLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogsList.fulfilled, (state, action) => {
        state.blogsLoading = false;
        state.blogs = action.payload.data;
        state.blogsMeta = action.payload.meta;
      })
      .addCase(fetchBlogsList.rejected, (state, action) => {
        state.blogsLoading = false;
        state.error = action.payload;
      })
      .addCase(createBlogPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.id) {
          state.blogs = [action.payload, ...state.blogs];
        }
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateBlogPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        if (!updated?.id) return;
        const index = state.blogs.findIndex((blog) => blog.id === updated.id);
        if (index >= 0) state.blogs[index] = updated;
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeBlogPost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeBlogPost.fulfilled, (state, action) => {
        state.deleting = false;
        state.blogs = state.blogs.filter(
          (blog) => blog.id !== action.payload.blogId,
        );
      })
      .addCase(removeBlogPost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogsError } = blogsSlice.actions;
export default blogsSlice.reducer;
