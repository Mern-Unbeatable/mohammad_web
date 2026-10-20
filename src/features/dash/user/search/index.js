/**
 * User search feature public API.
 *
 * - searchApi     → HTTP
 * - searchThunks  → async actions
 * - searchSlice   → state + sync reducers
 * - searchMappers → result models
 * - useGlobalSearch → page-level search state (independent of the slice)
 */

export { default as userSearchReducer } from "./searchSlice";
export { clearSearchError, clearSearchResults } from "./searchSlice";
export { fetchGlobalSearch } from "./searchThunks";
export { toSearchResultsModel } from "./searchMappers";
export { useGlobalSearch } from "./useGlobalSearch";
export * as searchApi from "./searchApi";
