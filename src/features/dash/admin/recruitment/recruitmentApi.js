import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin recruitment HTTP helpers — no Redux. Used by recruitmentThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let jobsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    jobsData = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    jobsData = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    jobsData = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && jobsData.length) {
    metaData = {
      ...metaData,
      total: jobsData.length,
      totalPages: Math.max(
        1,
        Math.ceil(jobsData.length / (metaData.pageSize || 10)),
      ),
    };
  }

  return { data: jobsData, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Jobs list
// ═══════════════════════════════════════════════════════════════════════
export async function getJobsList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.RECRUITMENT.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Job details
// ═══════════════════════════════════════════════════════════════════════
export async function getJobById(jobId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.RECRUITMENT.DETAILS(jobId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Job applications
// ═══════════════════════════════════════════════════════════════════════
export async function getJobApplications(jobId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.RECRUITMENT.APPLICATIONS(jobId),
  );
  const data = unwrapApiData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

// ═══════════════════════════════════════════════════════════════════════
// Delete job
// ═══════════════════════════════════════════════════════════════════════
export async function deleteJob(jobId) {
  const response = await crudService.del(
    API_ENDPOINTS.ADMIN.RECRUITMENT.DELETE(jobId),
  );
  return { jobId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
