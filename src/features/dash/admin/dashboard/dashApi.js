import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin dashboard HTTP helpers — no Redux. Used by dashThunks.
 */

const emptyDashboard = {
  stats: [],
  attention: { reports: [], ads: [] },
  snapshot: {
    newSubscribers: 0,
    newJobs: 0,
    totalListings: 0,
    pendingReports: 0,
    pendingAds: 0,
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Dashboard KPIs + attention queues
// ═══════════════════════════════════════════════════════════════════════
export async function getDashboardStats() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  const data = unwrapApiData(response) || response;

  if (Array.isArray(data?.stats)) {
    return {
      stats: data.stats,
      attention: data.attention || emptyDashboard.attention,
      snapshot: data.snapshot || emptyDashboard.snapshot,
    };
  }

  if (Array.isArray(data)) {
    return { ...emptyDashboard, stats: data };
  }

  return emptyDashboard;
}

export { getApiErrorMessage };
