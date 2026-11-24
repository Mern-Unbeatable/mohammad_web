import { createAsyncThunk } from "@reduxjs/toolkit";
import * as generalApi from "./generalApi";

/**
 * Supplier general async thunks — orchestration only; HTTP in generalApi.
 */

export const fetchSupplierGeneralPosts = createAsyncThunk(
  "supplierGeneral/fetchSupplierGeneralPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await generalApi.getPostsList(params);
    } catch (err) {
      return rejectWithValue(
        generalApi.getApiErrorMessage(err, "Failed to load general posts"),
      );
    }
  },
);

export const fetchSupplierGeneralPostDetails = createAsyncThunk(
  "supplierGeneral/fetchSupplierGeneralPostDetails",
  async (postId, { rejectWithValue }) => {
    try {
      return await generalApi.getPostById(postId);
    } catch (err) {
      return rejectWithValue(
        generalApi.getApiErrorMessage(err, "Failed to load post details"),
      );
    }
  },
);

export const createSupplierGeneralPost = createAsyncThunk(
  "supplierGeneral/createSupplierGeneralPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await generalApi.createPost(payload);
    } catch (err) {
      return rejectWithValue(
        generalApi.getApiErrorMessage(err, "Failed to create post"),
      );
    }
  },
);

export const updateSupplierGeneralPost = createAsyncThunk(
  "supplierGeneral/updateSupplierGeneralPost",
  async ({ postId, payload }, { rejectWithValue }) => {
    try {
      return await generalApi.updatePost(postId, payload);
    } catch (err) {
      return rejectWithValue(
        generalApi.getApiErrorMessage(err, "Failed to update post"),
      );
    }
  },
);

export const removeSupplierGeneralPost = createAsyncThunk(
  "supplierGeneral/removeSupplierGeneralPost",
  async (postId, { rejectWithValue }) => {
    try {
      return await generalApi.deletePost(postId);
    } catch (err) {
      return rejectWithValue(
        generalApi.getApiErrorMessage(err, "Failed to delete post"),
      );
    }
  },
);
