import axios from "axios";
import { tokenService } from "./cookies";
import { API_ENDPOINTS } from "./httpEndpoints";
import { unwrapApiData } from "./unwrapApiData";
import { notifyTokenRefreshed, notifyUnauthorized } from "./sessionBridge";

/** Must match Postman `baseUrl` (includes `/api/v1`). */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Bare client for token refresh / logout — no auth or 401 interceptors.
 * Callers receive the raw Axios response (`response.data` is the envelope).
 */
export const bareAuthClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let refreshQueue = [];
let handlingUnauthorized = false;

const flushRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

const isAuthCredentialRequest = (url = "") =>
  url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
  url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
  url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
  url.includes(API_ENDPOINTS.AUTH.LOGOUT);

const isMeRequest = (url = "") => url.includes(API_ENDPOINTS.AUTH.ME);

const clearSessionAndRedirect = () => {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  try {
    tokenService.clearAuth();
    notifyUnauthorized();

    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
  } finally {
    handlingUnauthorized = false;
  }
};

/** Refresh tokens without importing authApi (breaks circular import with axios). */
const refreshAccessToken = async () => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const { data: envelope } = await bareAuthClient.post(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken },
  );
  const data = unwrapApiData(envelope) || envelope;
  const remember = tokenService.getRemember();
  const session = tokenService.persistSession({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    user: tokenService.getUser(),
    remember,
  });

  const accessToken = session?.accessToken || data?.accessToken;
  if (!accessToken) {
    throw new Error("Refresh did not return an access token");
  }

  notifyTokenRefreshed(accessToken);
  return accessToken;
};

/**
 * Attempt refresh + retry. Concurrent 401s share one refresh via a queue.
 */
const refreshAndRetry = async (originalRequest) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(originalRequest);
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const accessToken = await refreshAccessToken();
    flushRefreshQueue(null, accessToken);
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    flushRefreshQueue(refreshError, null);
    clearSessionAndRedirect();
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;
    const url = originalRequest.url || "";

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthCredentialRequest(url) &&
      tokenService.getRefreshToken()
    ) {
      if (isMeRequest(url) || !isAuthCredentialRequest(url)) {
        try {
          return await refreshAndRetry(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }

    if (status === 401 && !isAuthCredentialRequest(url)) {
      clearSessionAndRedirect();
    }

    const payload =
      error?.response?.data?.error || error?.response?.data || error;
    const message =
      payload?.message ||
      (typeof payload === "string" ? payload : null) ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      data: error?.response?.data,
      details: payload?.details || error?.response?.data?.errors || null,
      code: payload?.code || null,
      raw: error,
    });
  },
);

export default axiosInstance;
