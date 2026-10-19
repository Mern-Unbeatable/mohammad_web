/**
 * User feed feature public API.
 *
 * - feedApi     → HTTP
 * - feedThunks  → async actions
 * - feedSlice   → state + sync reducers
 * - feedMappers → post card models
 */

export { default as userFeedReducer } from "./feedSlice";
export {
  clearFeedError,
  clearSelectedPost,
  invalidateFeedPosts,
} from "./feedSlice";
export {
  fetchFeed,
  fetchMoreFeed,
  fetchMyPosts,
  fetchMoreMyPosts,
  fetchAuthorPosts,
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
export {
  toFeedPostModel,
  toUpdatePostPayload,
  getPostImageUrls,
  formatRelativeTime,
} from "./feedMappers";
export * as feedApi from "./feedApi";
export { getApiErrorMessage } from "@/config";
