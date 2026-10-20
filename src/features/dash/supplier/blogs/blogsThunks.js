import { createAsyncThunk } from "@reduxjs/toolkit";
import * as blogsApi from "./blogsApi";

/**
 * Supplier blogs async thunks — orchestration only; HTTP in blogsApi.
 */

export const fetchSupplierBlogs = createAsyncThunk(
  "supplierBlogs/fetchSupplierBlogs",
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

export const fetchSupplierLatestBlogs = createAsyncThunk(
  "supplierBlogs/fetchSupplierLatestBlogs",
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

export const fetchSupplierBlogBySlug = createAsyncThunk(
  "supplierBlogs/fetchSupplierBlogBySlug",
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
