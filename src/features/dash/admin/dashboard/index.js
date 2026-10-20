/**
 * Admin dashboard feature public API.
 *
 * - dashApi     → HTTP
 * - dashThunks  → async actions
 * - dashSlice   → state + sync reducers
 */

export { default as adminDashboardReducer } from "./dashSlice";
export { clearAdminError } from "./dashSlice";
export { fetchAdminDashboardStats } from "./dashThunks";
export * as dashApi from "./dashApi";
