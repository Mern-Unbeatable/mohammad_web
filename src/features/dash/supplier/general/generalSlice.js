import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierGeneralPosts,
  fetchSupplierGeneralPostDetails,
  createSupplierGeneralPost,
  updateSupplierGeneralPost,
  removeSupplierGeneralPost,
} from "./generalThunks";

const initialState = {
  posts: [],
  postsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedPost: null,
  postsLoading: false,
  selectedPostLoading: false,
  saving: false,
  deleting: false,
  error: null,
};

const upsertPost = (state, post) => {
  if (!post?.id) return;
  const index = state.posts.findIndex((row) => row.id === post.id);
  if (index >= 0) state.posts[index] = post;
  else state.posts = [post, ...state.posts];
  if (state.selectedPost?.id === post.id) state.selectedPost = post;
};

const generalSlice = createSlice({
  name: "supplierGeneral",
  initialState,
  reducers: {
    clearGeneralError: (state) => {
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    /** Sync: show skeletons before paint when filter/page changes */
    invalidateGeneralPostsList: (state) => {
      state.postsLoading = true;
      state.posts = [];
      state.postsMeta = {
        ...state.postsMeta,
        total: 0,
        totalPages: 1,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierGeneralPosts.pending, (state) => {
        state.postsLoading = true;
        state.error = null;
        state.posts = [];
        state.postsMeta = {
          ...state.postsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchSupplierGeneralPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload.data;
        state.postsMeta = action.payload.meta;
      })
      .addCase(fetchSupplierGeneralPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierGeneralPostDetails.pending, (state) => {
        state.selectedPostLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierGeneralPostDetails.fulfilled, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchSupplierGeneralPostDetails.rejected, (state, action) => {
        state.selectedPostLoading = false;
        state.error = action.payload;
      })
      .addCase(createSupplierGeneralPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createSupplierGeneralPost.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.id) {
          state.posts = [action.payload, ...state.posts];
          state.postsMeta = {
            ...state.postsMeta,
            total: (state.postsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createSupplierGeneralPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateSupplierGeneralPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSupplierGeneralPost.fulfilled, (state, action) => {
        state.saving = false;
        upsertPost(state, action.payload);
      })
      .addCase(updateSupplierGeneralPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeSupplierGeneralPost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeSupplierGeneralPost.fulfilled, (state, action) => {
        state.deleting = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.postId,
        );
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost = null;
        }
      })
      .addCase(removeSupplierGeneralPost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearGeneralError,
  clearSelectedPost,
  invalidateGeneralPostsList,
} = generalSlice.actions;
export default generalSlice.reducer;
