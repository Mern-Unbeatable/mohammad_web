import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * User recruitment HTTP helpers — no Redux. Used by recruitmentThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let jobsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 5,
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
        Math.ceil(jobsData.length / (metaData.pageSize || 5)),
      ),
    };
  }

  return { data: jobsData, meta: metaData };
};

export async function getJobsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 5,
    sort: "desc",
    ...params,
  };
  if (!query.level) delete query.level;
  if (!query.search) delete query.search;
  if (!query.since) delete query.since;
  if (query.mine === undefined || query.mine === null) delete query.mine;

  const response = await crudService.get(
    API_ENDPOINTS.USER.RECRUITMENT.LIST,
    query,
  );
  return parseListResponse(response, query);
}

export async function getJobById(jobId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.RECRUITMENT.DETAILS(jobId),
  );
  return unwrapApiData(response) || response;
}

export async function createJob(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.RECRUITMENT.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function updateJob(jobId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.RECRUITMENT.UPDATE(jobId),
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function deleteJob(jobId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.RECRUITMENT.DELETE(jobId),
  );
  return { jobId, data: unwrapApiData(response) ?? response };
}

export async function applyToJob(jobId, payload = {}) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.RECRUITMENT.APPLY(jobId),
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function withdrawApplication(jobId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.RECRUITMENT.APPLY(jobId),
  );
  return unwrapApiData(response) ?? response;
}

export async function getMyApplications(params = {}) {
  const query = {
    page: 1,
    pageSize: 10,
    sort: "desc",
    ...params,
  };
  const response = await crudService.get(
    API_ENDPOINTS.USER.RECRUITMENT.MY_APPLICATIONS,
    query,
  );
  return parseListResponse(response, query);
}

export async function getJobApplications(jobId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.RECRUITMENT.APPLICATIONS(jobId),
  );
  const data = unwrapApiData(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

/** Unseen applications on my jobs: `{ total, byJob: { [jobId]: count } }`. */
export async function getNewApplicationCounts() {
  const response = await crudService.get(
    API_ENDPOINTS.USER.RECRUITMENT.NEW_APPLICATION_COUNTS,
  );
  const data = unwrapApiData(response) || response;
  return {
    total: Number(data?.total) || 0,
    byJob: data?.byJob && typeof data.byJob === "object" ? data.byJob : {},
  };
}

/** Field name must be `file` (multer upload.single("file")). Returns the public URL. */
export async function uploadJobImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await crudService.upload(
    API_ENDPOINTS.USER.UPLOADS.SINGLE,
    formData,
    null,
    { timeout: 60000 },
  );
  const data = unwrapApiData(response) || response;
  if (!data?.url) throw new Error("Upload did not return a file URL");
  return data.url;
}

export { getApiErrorMessage };
