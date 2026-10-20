import { createAsyncThunk } from "@reduxjs/toolkit";
import * as generalApi from "./generalApi";

/**
 * Admin general async thunks — orchestration only; HTTP in generalApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Posts list
// ═══════════════════════════════════════════════════════════════════════
export const fetchGeneralPosts = createAsyncThunk(
  "adminGeneral/fetchGeneralPosts",
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

// ═══════════════════════════════════════════════════════════════════════
// Post details
// ═══════════════════════════════════════════════════════════════════════
export const fetchGeneralPostDetails = createAsyncThunk(
  "adminGeneral/fetchGeneralPostDetails",
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

// ═══════════════════════════════════════════════════════════════════════
// Delete post
// ═══════════════════════════════════════════════════════════════════════
export const removeGeneralPost = createAsyncThunk(
  "adminGeneral/removeGeneralPost",
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
