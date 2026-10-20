import { createAsyncThunk } from "@reduxjs/toolkit";
import * as feedApi from "./feedApi";

/**
 * User feed async thunks — orchestration only; HTTP in feedApi.
 */

export const fetchFeed = createAsyncThunk(
  "userFeed/fetchFeed",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await feedApi.getFeed(params);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load feed"),
      );
    }
  },
);

/** Next page of the home feed; `params` is the current query with the following page number. */
export const fetchMoreFeed = createAsyncThunk(
  "userFeed/fetchMoreFeed",
  async (params, { rejectWithValue }) => {
    try {
      return await feedApi.getFeed(params);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load more posts"),
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { postsLoading, postsLoadingMore } = getState().userFeed;
      return !postsLoading && !postsLoadingMore;
    },
  },
);

export const MY_POSTS_QUERY = { page: 1, pageSize: 5, mine: true, sort: "desc" };

/** Signed-in user's own posts; served from cache unless never loaded or marked stale. */
export const fetchMyPosts = createAsyncThunk(
  "userFeed/fetchMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      return await feedApi.getFeed(MY_POSTS_QUERY);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load your posts"),
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { myPostsLoading, myPostsLoaded, myPostsStale } =
        getState().userFeed;
      if (myPostsLoading) return false;
      return !myPostsLoaded || myPostsStale;
    },
  },
);

export const fetchMoreMyPosts = createAsyncThunk(
  "userFeed/fetchMoreMyPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { page = 1 } = getState().userFeed.myPostsMeta;
      return await feedApi.getFeed({ ...MY_POSTS_QUERY, page: page + 1 });
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load more posts"),
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { myPostsLoaded, myPostsLoading, myPostsLoadingMore } =
        getState().userFeed;
      return myPostsLoaded && !myPostsLoading && !myPostsLoadingMore;
    },
  },
);

export const AUTHOR_POSTS_PAGE_SIZE = 10;

/** One member's posts for their profile page; page 1 replaces the list, later pages append. */
export const fetchAuthorPosts = createAsyncThunk(
  "userFeed/fetchAuthorPosts",
  async ({ authorId, page = 1 }, { rejectWithValue }) => {
    try {
      return await feedApi.getFeed({
        authorId,
        page,
        pageSize: AUTHOR_POSTS_PAGE_SIZE,
        sort: "desc",
      });
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load posts"),
      );
    }
  },
  {
    condition: ({ authorId, page = 1 }, { getState }) => {
      if (!authorId) return false;
      if (page === 1) return true;
      const { authorPostsLoading, authorPostsLoadingMore, authorPostsAuthorId } =
        getState().userFeed;
      return (
        authorPostsAuthorId === authorId &&
        !authorPostsLoading &&
        !authorPostsLoadingMore
      );
    },
  },
);

export const fetchPostDetails = createAsyncThunk(
  "userFeed/fetchPostDetails",
  async (postId, { rejectWithValue }) => {
    try {
      return await feedApi.getPostById(postId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load post"),
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "userFeed/createPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await feedApi.createPost(payload);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to create post"),
      );
    }
  },
);

export const updatePost = createAsyncThunk(
  "userFeed/updatePost",
  async ({ postId, payload }, { rejectWithValue }) => {
    try {
      return await feedApi.updatePost(postId, payload);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to update post"),
      );
    }
  },
);

export const removePost = createAsyncThunk(
  "userFeed/removePost",
  async (postId, { rejectWithValue }) => {
    try {
      return await feedApi.deletePost(postId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to delete post"),
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "userFeed/addComment",
  async ({ postId, body, parentCommentId }, { rejectWithValue }) => {
    try {
      const comment = await feedApi.addComment(postId, {
        content: body,
        parentCommentId,
      });
      return { postId, comment, parentCommentId: comment?.parentCommentId ?? parentCommentId ?? null };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to add comment"),
      );
    }
  },
);

export const editComment = createAsyncThunk(
  "userFeed/editComment",
  async ({ postId, commentId, body }, { rejectWithValue }) => {
    try {
      const comment = await feedApi.updateComment(postId, commentId, body);
      return { postId, commentId, comment };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to update comment"),
      );
    }
  },
);

export const removeComment = createAsyncThunk(
  "userFeed/removeComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      return await feedApi.deleteComment(postId, commentId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to delete comment"),
      );
    }
  },
);

export const reactToPost = createAsyncThunk(
  "userFeed/reactToPost",
  async ({ postId, type }, { rejectWithValue }) => {
    try {
      const data = await feedApi.reactToPost(postId, type);
      return { postId, type, data };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to react to post"),
      );
    }
  },
);

export const repostPost = createAsyncThunk(
  "userFeed/repostPost",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      return await feedApi.repostPost(postId, content);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to repost"),
      );
    }
  },
);

export const undoRepost = createAsyncThunk(
  "userFeed/undoRepost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      return await feedApi.undoRepost(postId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to undo repost"),
      );
    }
  },
);

export const likeComment = createAsyncThunk(
  "userFeed/likeComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const data = await feedApi.likeComment(postId, commentId);
      return { postId, commentId, data };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to like comment"),
      );
    }
  },
);
