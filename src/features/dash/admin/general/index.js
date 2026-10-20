/**
 * Admin general feature public API.
 *
 * - generalApi     → HTTP
 * - generalThunks  → async actions
 * - generalSlice   → state + sync reducers
 */

export { default as adminGeneralReducer } from "./generalSlice";
export { clearGeneralError, clearSelectedPost } from "./generalSlice";
export {
  fetchGeneralPosts,
  fetchGeneralPostDetails,
  removeGeneralPost,
} from "./generalThunks";
export * as generalApi from "./generalApi";
