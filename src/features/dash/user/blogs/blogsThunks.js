import { createAsyncThunk } from "@reduxjs/toolkit";
import * as blogsApi from "./blogsApi";

/**
 * User blogs async thunks — orchestration only; HTTP in blogsApi.
 */

export const fetchBlogs = createAsyncThunk(
  "userBlogs/fetchBlogs",
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

export const fetchLatestBlogs = createAsyncThunk(
  "userBlogs/fetchLatestBlogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await blogsApi.getBlogsList({
        page: 1,
        pageSize: 6,
        sort: "desc",
        ...params,
      });
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to load latest articles"),
      );
    }
  },
);

export const fetchBlogBySlug = createAsyncThunk(
  "userBlogs/fetchBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await blogsApi.getBlogBySlug(slug);
    } catch (err) {
      return rejectWithValue(
        blogsApi.getApiErrorMessage(err, "Failed to load article"),
      );
    }
  },
);
