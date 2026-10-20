/**
 * Supplier dashboard feature public API.
 *
 * - dashApi     → HTTP (ads + notifications)
 * - dashThunks  → async actions
 * - dashSlice   → state + sync reducers
 * - dashMappers → overview UI models
 */

export { default as supplierDashboardReducer } from "./dashSlice";
export { clearSupplierDashError } from "./dashSlice";
export { fetchSupplierDashboard } from "./dashThunks";
export * as dashApi from "./dashApi";
export {
  toAdRowModel,
  buildDashboardStats,
  buildPerformanceChart,
  toNotificationModel,
  mapDashboardPayload,
} from "./dashMappers";
