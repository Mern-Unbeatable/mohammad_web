import { createAsyncThunk } from "@reduxjs/toolkit";
import * as generalApi from "./generalApi";

/**
 * User general async thunks — orchestration only; HTTP in generalApi.
 */

export const fetchGeneralPosts = createAsyncThunk(
  "userGeneral/fetchGeneralPosts",
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

export const fetchGeneralPostDetails = createAsyncThunk(
  "userGeneral/fetchGeneralPostDetails",
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

export const createGeneralPost = createAsyncThunk(
  "userGeneral/createGeneralPost",
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

export const updateGeneralPost = createAsyncThunk(
  "userGeneral/updateGeneralPost",
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

export const removeGeneralPost = createAsyncThunk(
  "userGeneral/removeGeneralPost",
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
