import { createAsyncThunk } from "@reduxjs/toolkit";
import * as blogsApi from "./blogsApi";

/**
 * Admin blogs async thunks — orchestration only; HTTP in blogsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Blogs list
// ═══════════════════════════════════════════════════════════════════════
export const fetchBlogsList = createAsyncThunk(
  "adminBlogs/fetchBlogsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await blogsApi.getBlogsList(params);
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to load blogs"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Create blog
// ═══════════════════════════════════════════════════════════════════════
export const createBlogPost = createAsyncThunk(
  "adminBlogs/createBlogPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await blogsApi.createBlog(payload);
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to create blog"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Update blog
// ═══════════════════════════════════════════════════════════════════════
export const updateBlogPost = createAsyncThunk(
  "adminBlogs/updateBlogPost",
  async ({ blogId, payload }, { rejectWithValue }) => {
    try {
      return await blogsApi.updateBlog(blogId, payload);
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to update blog"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Delete blog
// ═══════════════════════════════════════════════════════════════════════
export const removeBlogPost = createAsyncThunk(
  "adminBlogs/removeBlogPost",
  async (blogId, { rejectWithValue }) => {
    try {
      return await blogsApi.deleteBlog(blogId);
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to delete blog"),
      );
    }
  },
);
