import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * User reports HTTP helpers — no Redux. Used by reportsThunks.
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

export async function createReport(payload) {
  const body = {
    targetType: payload.targetType,
    reason: payload.reason,
  };
  if (payload.targetId) body.targetId = payload.targetId;
  if (payload.reportedUserId) body.reportedUserId = payload.reportedUserId;
  if (payload.targetSnippet) body.targetSnippet = payload.targetSnippet;
  if (payload.reasonDetail) body.reasonDetail = payload.reasonDetail;

  const response = await crudService.post(
    API_ENDPOINTS.USER.REPORTS.CREATE,
    body,
  );
  return unwrapApiData(response) || response;
}

export async function getMyReports(params = {}) {
  const query = {
    page: 1,
    pageSize: 10,
    sort: "desc",
    ...params,
  };
  const response = await crudService.get(
    API_ENDPOINTS.USER.REPORTS.MINE,
    query,
  );
  return parseListResponse(response, query);
}

export { getApiErrorMessage };
