import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin reports HTTP helpers — no Redux. Used by reportsThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    rows = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    rows = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    rows = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && rows.length) {
    metaData = {
      ...metaData,
      total: rows.length,
      totalPages: Math.max(
        1,
        Math.ceil(rows.length / (metaData.pageSize || 10)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Reports list
// ═══════════════════════════════════════════════════════════════════════
export async function getReportsList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.REPORTS.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Report stats
// ═══════════════════════════════════════════════════════════════════════
export async function getReportStats() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.REPORTS.STATS);
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Report details
// ═══════════════════════════════════════════════════════════════════════
export async function getReportById(reportId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.REPORTS.DETAILS(reportId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Update status
// ═══════════════════════════════════════════════════════════════════════
export async function patchReportStatus(reportId, status) {
  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.REPORTS.STATUS(reportId),
    { status },
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Moderate
// ═══════════════════════════════════════════════════════════════════════
export async function postModerate(reportId, action, note) {
  const response = await crudService.post(
    API_ENDPOINTS.ADMIN.REPORTS.MODERATE(reportId),
    { action, note },
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
