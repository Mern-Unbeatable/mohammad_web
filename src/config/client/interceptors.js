import { API_ENDPOINTS } from "../endpoints";
import { tokenService } from "../session/tokenStorage";
import { notifyUnauthorized } from "../session/sessionBridge";
import { normalizeAxiosError } from "../utils/errors";
import { refreshAccessToken } from "./tokenRefresh";

const isAuthCredentialRequest = (url = "") =>
  url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
  url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
  url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
  url.includes(API_ENDPOINTS.AUTH.LOGOUT);

let handlingUnauthorized = false;

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

/** Bearer auth, response unwrapping, shared 401 refresh-and-retry and error shaping. */
export const setupInterceptors = (client) => {
  let isRefreshing = false;
  let refreshQueue = [];

  const flushRefreshQueue = (error, token = null) => {
    refreshQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token);
    });
    refreshQueue = [];
  };

  /** Concurrent 401s share one refresh via a queue. */
  const refreshAndRetry = async (originalRequest) => {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      flushRefreshQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return client(originalRequest);
    } catch (refreshError) {
      flushRefreshQueue(refreshError, null);
      clearSessionAndRedirect();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  };

  client.interceptors.request.use(
    (config) => {
      const token = tokenService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error?.config || {};
      const status = error?.response?.status;
      const url = originalRequest.url || "";

      if (
        status === 401 &&
        !originalRequest._retry &&
        !isAuthCredentialRequest(url)
      ) {
        // The refresh token lives in an httpOnly cookie we can't read, so we
        // always attempt a single cookie-based refresh on 401.
        return refreshAndRetry(originalRequest);
      }

      if (status === 401 && !isAuthCredentialRequest(url)) {
        clearSessionAndRedirect();
      }

      return Promise.reject(normalizeAxiosError(error));
    },
  );

  return client;
};
