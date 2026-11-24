/**
 * Admin statistics feature public API.
 *
 * - statsApi     → HTTP
 * - statsThunks  → async actions
 * - statsSlice   → state + sync reducers
 */

export { default as adminStatisticsReducer } from "./statsSlice";
export { clearStatisticsError } from "./statsSlice";
export { fetchAdminStatistics } from "./statsThunks";
export * as statsApi from "./statsApi";
