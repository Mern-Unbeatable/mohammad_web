import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Admin dashboard HTTP helpers — no Redux. Used by dashThunks.
 */

// ═══════════════════════════════════════════════════════════════════════
// Dashboard KPIs
// ═══════════════════════════════════════════════════════════════════════
export async function getDashboardStats() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  const data = unwrapApiData(response) || response;
  return Array.isArray(data?.stats)
    ? data.stats
    : Array.isArray(data)
      ? data
      : [];
}

export { getApiErrorMessage };
