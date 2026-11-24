import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser } from "@/features/auth/authThunks";
import {
  fetchFeed,
  fetchMoreFeed,
  fetchMyPosts,
  fetchMoreMyPosts,
  fetchAuthorPosts,
  AUTHOR_POSTS_PAGE_SIZE,
  fetchPostDetails,
  createPost,
  updatePost,
  removePost,
  addComment,
  editComment,
  removeComment,
  reactToPost,
  repostPost,
  undoRepost,
  likeComment,
} from "./feedThunks";

const initialState = {
  posts: [],
  postsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedPost: null,
  postsLoading: false,
  postsRequestId: null,
  postsLoadingMore: false,
  postsMoreRequestId: null,
  postsError: null,
  myPosts: [],
  myPostsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
  myPostsLoading: false,
  myPostsLoadingMore: false,
  myPostsLoaded: false,
  myPostsStale: false,
  myPostsError: null,
  /** Posts on another member's profile page. */
  authorPosts: [],
  authorPostsAuthorId: null,
  authorPostsMeta: {
    page: 1,
    pageSize: AUTHOR_POSTS_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  },
  authorPostsLoading: false,
  authorPostsLoadingMore: false,
  authorPostsRequestId: null,
  authorPostsError: null,
  selectedPostLoading: false,
  saving: false,
  deleting: false,
  commenting: false,
  reactingId: null,
  repostingId: null,
  likingCommentId: null,
  error: null,
};

const upsertPost = (state, post) => {
  if (!post?.id) return;
  const index = state.posts.findIndex((row) => row.id === post.id);
  if (index >= 0) state.posts[index] = post;
  else state.posts = [post, ...state.posts];
  if (state.selectedPost?.id === post.id) state.selectedPost = post;
  const mineIndex = state.myPosts.findIndex((row) => row.id === post.id);
  if (mineIndex >= 0) state.myPosts[mineIndex] = post;
  const authorIndex = state.authorPosts.findIndex((row) => row.id === post.id);
  if (authorIndex >= 0) state.authorPosts[authorIndex] = post;
};

const mapAllPosts = (state, mapper) => {
  state.posts = state.posts.map(mapper);
  state.myPosts = state.myPosts.map(mapper);
  state.authorPosts = state.authorPosts.map(mapper);
  state.selectedPost = state.selectedPost ? mapper(state.selectedPost) : null;
};

/** Offset pages shift when posts are added meanwhile, so skip rows already shown. */
const appendUnique = (list, incoming) => {
  const seen = new Set(list.map((post) => post.id));
  return [...list, ...(incoming || []).filter((post) => !seen.has(post.id))];
};

/** Show the viewer's new post or repost on a profile page that lists their posts. */
const prependToAuthorPosts = (state, post) => {
  if (!post?.id || post.author?.id !== state.authorPostsAuthorId) return;
  if (state.authorPosts.some((row) => row.id === post.id)) return;
  state.authorPosts = [post, ...state.authorPosts];
  state.authorPostsMeta = {
    ...state.authorPostsMeta,
    total: (state.authorPostsMeta.total || 0) + 1,
  };
};

/** Sync the original's share count and every card's "Shared" state for it. */
const applyRepostStatus = (state, originalPostId, { shares, sharedByMe }) => {
  if (!originalPostId) return;
  mapAllPosts(state, (post) => {
    if (post.id === originalPostId) {
      return {
        ...post,
        sharedByMe,
        stats: {
          ...(post.stats || {}),
          shares: shares ?? post.stats?.shares ?? 0,
        },
      };
    }
    if (post.sharedPostId === originalPostId) return { ...post, sharedByMe };
    return post;
  });
};

const removePostFromLists = (state, postId) => {
  const before = state.posts.length;
  state.posts = state.posts.filter((post) => post.id !== postId);
  if (state.posts.length < before) {
    state.postsMeta = {
      ...state.postsMeta,
      total: Math.max(0, (state.postsMeta.total || 0) - 1),
    };
  }
  if (state.myPosts.some((post) => post.id === postId)) {
    state.myPosts = state.myPosts.filter((post) => post.id !== postId);
    state.myPostsStale = true;
  }
  const authorBefore = state.authorPosts.length;
  state.authorPosts = state.authorPosts.filter((post) => post.id !== postId);
  if (state.authorPosts.length < authorBefore) {
    state.authorPostsMeta = {
      ...state.authorPostsMeta,
      total: Math.max(0, (state.authorPostsMeta.total || 0) - 1),
    };
  }
  if (state.selectedPost?.id === postId) state.selectedPost = null;
};

const resetAuthorPosts = (state) => {
  state.authorPosts = [];
  state.authorPostsAuthorId = null;
  state.authorPostsMeta = initialState.authorPostsMeta;
  state.authorPostsLoading = false;
  state.authorPostsLoadingMore = false;
  state.authorPostsRequestId = null;
  state.authorPostsError = null;
};

const resetMyPosts = (state) => {
  state.myPosts = [];
  state.myPostsMeta = initialState.myPostsMeta;
  state.myPostsLoading = false;
  state.myPostsLoadingMore = false;
  state.myPostsLoaded = false;
  state.myPostsStale = false;
  state.myPostsError = null;
};

/** Per-viewer lists must not survive a change of signed-in user. */
const resetViewerLists = (state) => {
  resetMyPosts(state);
  resetAuthorPosts(state);
};

const feedSlice = createSlice({
  name: "userFeed",
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    invalidateFeedPosts: (state) => {
      state.postsLoading = true;
      state.posts = [];
      state.postsMeta = {
        ...state.postsMeta,
        total: 0,
        totalPages: 1,
      };
      state.error = null;
      state.postsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        state.postsLoading = true;
        state.postsRequestId = action.meta.requestId;
        // A fresh first page supersedes any "load more" still in flight.
        state.postsLoadingMore = false;
        state.postsMoreRequestId = null;
        state.error = null;
        state.postsError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.postsRequestId) return;
        state.postsLoading = false;
        state.posts = action.payload.data;
        state.postsMeta = action.payload.meta;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        if (action.meta.requestId !== state.postsRequestId) return;
        state.postsLoading = false;
        state.error = action.payload;
        state.postsError = action.payload || "Failed to load feed";
      })
      .addCase(fetchMoreFeed.pending, (state, action) => {
        state.postsLoadingMore = true;
        state.postsMoreRequestId = action.meta.requestId;
      })
      .addCase(fetchMoreFeed.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.postsMoreRequestId) return;
        state.postsLoadingMore = false;
        state.postsMoreRequestId = null;
        state.posts = appendUnique(state.posts, action.payload.data);
        state.postsMeta = action.payload.meta;
      })
      .addCase(fetchMoreFeed.rejected, (state, action) => {
        if (action.meta.requestId !== state.postsMoreRequestId) return;
        state.postsLoadingMore = false;
        state.postsMoreRequestId = null;
        state.error = action.payload || "Failed to load more posts";
      })
      .addCase(fetchMyPosts.pending, (state) => {
        state.myPostsLoading = true;
        state.myPostsError = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.myPostsLoading = false;
        state.myPostsLoaded = true;
        state.myPostsStale = false;
        state.myPosts = action.payload.data;
        state.myPostsMeta = action.payload.meta;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.myPostsLoading = false;
        state.myPostsError = action.payload || "Failed to load your posts";
      })
      .addCase(fetchMoreMyPosts.pending, (state) => {
        state.myPostsLoadingMore = true;
      })
      .addCase(fetchMoreMyPosts.fulfilled, (state, action) => {
        state.myPostsLoadingMore = false;
        state.myPosts = appendUnique(state.myPosts, action.payload.data);
        state.myPostsMeta = action.payload.meta;
      })
      .addCase(fetchMoreMyPosts.rejected, (state, action) => {
        state.myPostsLoadingMore = false;
        state.error = action.payload || "Failed to load more posts";
      })
      .addCase(fetchAuthorPosts.pending, (state, action) => {
        const { authorId, page = 1 } = action.meta.arg;
        state.authorPostsRequestId = action.meta.requestId;
        state.authorPostsError = null;
        if (page > 1) {
          state.authorPostsLoadingMore = true;
          return;
        }
        if (state.authorPostsAuthorId !== authorId) {
          state.authorPosts = [];
          state.authorPostsMeta = initialState.authorPostsMeta;
        }
        state.authorPostsAuthorId = authorId;
        state.authorPostsLoading = true;
        state.authorPostsLoadingMore = false;
      })
      .addCase(fetchAuthorPosts.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.authorPostsRequestId) return;
        const { page = 1 } = action.meta.arg;
        state.authorPostsLoading = false;
        state.authorPostsLoadingMore = false;
        state.authorPosts =
          page > 1
            ? appendUnique(state.authorPosts, action.payload.data)
            : action.payload.data;
        state.authorPostsMeta = action.payload.meta;
      })
      .addCase(fetchAuthorPosts.rejected, (state, action) => {
        if (action.meta.requestId !== state.authorPostsRequestId) return;
        state.authorPostsLoading = false;
        state.authorPostsLoadingMore = false;
        state.authorPostsError = action.payload || "Failed to load posts";
      })
      .addCase(logoutUser.fulfilled, resetViewerLists)
      .addCase(logoutUser.rejected, resetViewerLists)
      .addCase(loginUser.fulfilled, resetViewerLists)
      .addCase(registerUser.fulfilled, resetViewerLists)
      .addCase(fetchPostDetails.pending, (state) => {
        state.selectedPostLoading = true;
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPost = action.payload;
        upsertPost(state, action.payload);
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.selectedPostLoading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.saving = false;
        upsertPost(state, action.payload);
        if (action.payload?.id) {
          state.postsMeta = {
            ...state.postsMeta,
            total: (state.postsMeta.total || 0) + 1,
          };
          if (state.myPostsLoaded) {
            state.myPosts = [
              action.payload,
              ...state.myPosts.filter((row) => row.id !== action.payload.id),
            ];
            state.myPostsStale = true;
          }
          prependToAuthorPosts(state, action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        if (!updated?.id) return;
        // Replace in place only, so editing from the profile doesn't add the post to a filtered feed.
        mapAllPosts(state, (post) => {
          if (post.id === updated.id) return updated;
          if (post.sharedPostId === updated.id && post.sharedPost) {
            return {
              ...post,
              sharedPost: {
                ...post.sharedPost,
                content: updated.content,
                imageUrl: updated.imageUrl,
                imageUrls: updated.imageUrls,
                documentUrl: updated.documentUrl,
              },
            };
          }
          return post;
        });
      })
      // The editor shows its own error toast, so the page-level `error` toast isn't triggered.
      .addCase(updatePost.rejected, (state) => {
        state.saving = false;
      })
      .addCase(removePost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.deleting = false;
        const removedId = action.payload.postId;
        const loaded = [...state.posts, ...state.myPosts, ...state.authorPosts];
        const removed = loaded.find((post) => post.id === removedId);
        if (removed?.isRepost && removed.sharedPostId) {
          const original = loaded.find(
            (post) => post.id === removed.sharedPostId,
          );
          applyRepostStatus(state, removed.sharedPostId, {
            shares: Math.max(0, (original?.stats?.shares ?? 1) - 1),
            sharedByMe: false,
          });
        }
        mapAllPosts(state, (post) =>
          post.sharedPostId === removedId
            ? { ...post, sharedPostId: null, sharedPost: null }
            : post,
        );
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.postId,
        );
        if (state.myPosts.some((post) => post.id === action.payload.postId)) {
          state.myPosts = state.myPosts.filter(
            (post) => post.id !== action.payload.postId,
          );
          state.myPostsStale = true;
        }
        state.authorPosts = state.authorPosts.filter(
          (post) => post.id !== action.payload.postId,
        );
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost = null;
        }
      })
      .addCase(removePost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.commenting = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commenting = false;
        const { postId, comment } = action.payload;
        const parentId =
          comment?.parentCommentId ?? action.payload.parentCommentId ?? null;

        const insertComment = (post) => {
          if (!post || post.id !== postId || !comment?.id) return post;
          const comments = Array.isArray(post.comments) ? post.comments : [];

          const exists = comments.some(
            (row) =>
              row.id === comment.id ||
              (Array.isArray(row.replies) &&
                row.replies.some((r) => r.id === comment.id)),
          );
          if (exists) return post;

          const nextCount =
            (post.stats?.comments ?? post.commentCount ?? 0) + 1;
          const nextComment = {
            ...comment,
            replies: [],
            replyCount: 0,
          };

          if (parentId) {
            return {
              ...post,
              comments: comments.map((row) => {
                if (row.id !== parentId) return row;
                const replies = Array.isArray(row.replies) ? row.replies : [];
                return {
                  ...row,
                  replyCount: (row.replyCount ?? replies.length) + 1,
                  replies: [...replies, nextComment],
                };
              }),
              commentCount: nextCount,
              stats: {
                ...(post.stats || {}),
                comments: nextCount,
              },
            };
          }

          return {
            ...post,
            comments: [...comments, nextComment],
            commentCount: nextCount,
            stats: {
              ...(post.stats || {}),
              comments: nextCount,
            },
          };
        };
        mapAllPosts(state, insertComment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commenting = false;
        state.error = action.payload;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const { postId, commentId, comment } = action.payload;
        const content = comment?.content;
        if (typeof content !== "string") return;

        const patchTree = (list = []) =>
          list.map((row) => {
            const next = row.id === commentId ? { ...row, content } : row;
            if (!Array.isArray(row.replies) || row.replies.length === 0) {
              return next;
            }
            return { ...next, replies: patchTree(row.replies) };
          });

        mapAllPosts(state, (post) =>
          post?.id === postId
            ? { ...post, comments: patchTree(post.comments) }
            : post,
        );
      })
      .addCase(removeComment.pending, (state) => {
        state.commenting = true;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.commenting = false;
        const { postId, commentId, data } = action.payload;
        const serverCount =
          typeof data?.commentCount === "number" ? data.commentCount : null;
        const stripComment = (post) => {
          if (!post || post.id !== postId) return post;
          let removed = 0;

          const countTree = (node) =>
            1 +
            (Array.isArray(node.replies)
              ? node.replies.reduce((sum, child) => sum + countTree(child), 0)
              : 0);

          const stripTree = (list = []) =>
            list
              .map((row) => {
                if (row.id === commentId) {
                  removed = countTree(row);
                  return null;
                }
                if (!Array.isArray(row.replies) || row.replies.length === 0) {
                  return row;
                }
                const nextReplies = stripTree(row.replies);
                if (nextReplies.length === row.replies.length) return row;
                return {
                  ...row,
                  replies: nextReplies,
                  replyCount: nextReplies.length,
                };
              })
              .filter(Boolean);

          const nextComments = stripTree(post.comments);
          const nextCount =
            serverCount ??
            Math.max(
              0,
              (post.stats?.comments ?? post.commentCount ?? 0) - removed,
            );
          return {
            ...post,
            comments: nextComments,
            commentCount: nextCount,
            stats: {
              ...(post.stats || {}),
              comments: nextCount,
            },
          };
        };
        mapAllPosts(state, stripComment);
      })
      .addCase(removeComment.rejected, (state) => {
        state.commenting = false;
      })
      .addCase(reactToPost.pending, (state, action) => {
        state.reactingId = action.meta.arg?.postId || null;
        state.error = null;
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        state.reactingId = null;
        const { postId, data } = action.payload;
        const myReaction =
          data?.myReaction !== undefined
            ? data.myReaction
            : data?.reacted
              ? data?.type ?? null
              : data?.reacted === false
                ? null
                : undefined;
        const reactionCount =
          data?.reactionCount ?? data?.stats?.reactions ?? undefined;

        const applyReaction = (post) => {
          if (!post || post.id !== postId) return post;

          const nextMyReaction =
            myReaction !== undefined ? myReaction : post.myReaction;
          const nextCount =
            reactionCount !== undefined
              ? reactionCount
              : (post.stats?.reactions ?? post.reactionCount ?? 0);

          return {
            ...post,
            myReaction: nextMyReaction,
            reactionCount: nextCount,
            reactionCounts: data?.reactionCounts ?? post.reactionCounts,
            stats: {
              ...(post.stats || {}),
              reactions: nextCount,
            },
          };
        };
        mapAllPosts(state, applyReaction);
      })
      .addCase(reactToPost.rejected, (state, action) => {
        state.reactingId = null;
        state.error = action.payload;
      })
      .addCase(repostPost.pending, (state, action) => {
        state.repostingId = action.meta.arg?.postId || null;
      })
      .addCase(repostPost.fulfilled, (state, action) => {
        state.repostingId = null;
        const { post, originalPostId, shares } = action.payload || {};
        if (post?.id && !state.posts.some((row) => row.id === post.id)) {
          state.posts = [post, ...state.posts];
          state.postsMeta = {
            ...state.postsMeta,
            total: (state.postsMeta.total || 0) + 1,
          };
        }
        if (
          post?.id &&
          state.myPostsLoaded &&
          !state.myPosts.some((row) => row.id === post.id)
        ) {
          state.myPosts = [post, ...state.myPosts];
          state.myPostsStale = true;
        }
        prependToAuthorPosts(state, post);
        applyRepostStatus(state, originalPostId, { shares, sharedByMe: true });
      })
      .addCase(repostPost.rejected, (state) => {
        state.repostingId = null;
      })
      .addCase(undoRepost.pending, (state, action) => {
        state.repostingId = action.meta.arg?.postId || null;
      })
      .addCase(undoRepost.fulfilled, (state, action) => {
        state.repostingId = null;
        const { repostId, originalPostId, shares } = action.payload || {};
        if (repostId) removePostFromLists(state, repostId);
        applyRepostStatus(state, originalPostId, { shares, sharedByMe: false });
      })
      .addCase(undoRepost.rejected, (state) => {
        state.repostingId = null;
      })
      .addCase(likeComment.pending, (state, action) => {
        state.likingCommentId = action.meta.arg?.commentId || null;
        state.error = null;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.likingCommentId = null;
        const { postId, commentId, data } = action.payload;
        const liked = Boolean(data?.liked ?? data?.isLiked);
        const likeCount =
          data?.likeCount ??
          (typeof data?.likesCount === "number" ? data.likesCount : undefined);

        const applyLike = (post) => {
          if (!post || post.id !== postId) return post;

          const patchTree = (list = []) =>
            list.map((comment) => {
              const next =
                comment.id === commentId
                  ? {
                      ...comment,
                      liked,
                      isLiked: liked,
                      likeCount:
                        likeCount !== undefined
                          ? likeCount
                          : Math.max(
                              0,
                              (comment.likeCount ?? 0) + (liked ? 1 : -1),
                            ),
                    }
                  : comment;
              if (!Array.isArray(comment.replies) || comment.replies.length === 0) {
                return next;
              }
              return { ...next, replies: patchTree(comment.replies) };
            });

          return {
            ...post,
            comments: patchTree(post.comments),
          };
        };
        mapAllPosts(state, applyLike);
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.likingCommentId = null;
        state.error = action.payload;
      });
  },
});

export const { clearFeedError, clearSelectedPost, invalidateFeedPosts } =
  feedSlice.actions;
export default feedSlice.reducer;
