/**
 * Admin reports feature public API.
 *
 * - reportsApi     → HTTP
 * - reportsThunks  → async actions
 * - reportsSlice   → state + sync reducers
 */

export { default as adminReportsReducer } from "./reportsSlice";
export { clearReportsError, clearSelectedReport } from "./reportsSlice";
export {
  fetchReportsList,
  fetchReportStats,
  fetchReportDetails,
  updateReportStatus,
  moderateReport,
} from "./reportsThunks";
export {
  statusFilterToApi,
  statusLabelToApi,
  toReportRowModel,
  toReportDetailModel,
  toStatCards,
} from "./reportsMappers";
export * as reportsApi from "./reportsApi";
