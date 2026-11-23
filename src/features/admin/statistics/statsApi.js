import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Admin statistics HTTP helpers — no Redux. Used by statsThunks.
 */

// ═══════════════════════════════════════════════════════════════════════
// Annual chart series
// ═══════════════════════════════════════════════════════════════════════
export async function getStatistics(yearArg) {
  const year =
    typeof yearArg === "number"
      ? yearArg
      : yearArg?.year || new Date().getFullYear();
  const response = await crudService.get(API_ENDPOINTS.ADMIN.STATISTICS, {
    year,
  });
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
