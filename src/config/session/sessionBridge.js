/**
 * Callbacks for axios 401 / token-refresh side effects.
 * Registered once at app boot so axiosInstance never imports store/router/auth
 * (avoids circular deps and Vite "dynamic + static import" warnings).
 */

let onUnauthorized = null;
let onTokenRefreshed = null;

export function registerSessionBridge(handlers = {}) {
  onUnauthorized = handlers.onUnauthorized ?? null;
  onTokenRefreshed = handlers.onTokenRefreshed ?? null;
}

export function notifyUnauthorized() {
  try {
    onUnauthorized?.();
  } catch {
    /* ignore handler errors */
  }
}

export function notifyTokenRefreshed(accessToken) {
  try {
    onTokenRefreshed?.(accessToken);
  } catch {
    /* ignore handler errors */
  }
}
