import Cookies from "js-cookie";

/**
 * In-memory session store.
 *
 * Access/refresh tokens are NEVER written to `localStorage` or JS-readable
 * cookies — the server issues them as httpOnly cookies, so they cannot be
 * stolen via XSS. We keep a transient copy of the access token in memory only
 * (for the Authorization header and the realtime socket handshake); it is lost
 * on reload and silently re-minted from the httpOnly refresh cookie by
 * `AuthSessionBridge`. The `remember` preference is non-sensitive and stays in
 * a normal cookie so the server can scope cookie lifetime if needed.
 */

const REMEMBER_KEY = "remember";

const isSecure = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const rememberCookieOptions = () => ({
  expires: 365,
  secure: isSecure(),
  sameSite: "strict",
  path: "/",
});

let accessToken = null;
let refreshToken = null;
let user = null;

export const tokenService = {
  getToken: () => accessToken,
  setToken: (token) => {
    accessToken = token || null;
  },

  // Retained for API compatibility; the real refresh token lives only in the
  // httpOnly cookie. We keep a transient copy so legacy callers don't break.
  getRefreshToken: () => refreshToken,
  setRefreshToken: (token) => {
    refreshToken = token || null;
  },

  getUser: () => user,
  setUser: (nextUser) => {
    user = nextUser || null;
  },

  getRemember: () => Cookies.get(REMEMBER_KEY) !== "0",
  setRemember: (remember) => {
    Cookies.set(REMEMBER_KEY, remember ? "1" : "0", rememberCookieOptions());
  },

  persistSession: ({
    accessToken: nextAccess,
    refreshToken: nextRefresh,
    user: nextUser,
    remember = true,
  } = {}) => {
    tokenService.setRemember(remember);
    if (nextAccess !== undefined) tokenService.setToken(nextAccess);
    if (nextRefresh !== undefined) tokenService.setRefreshToken(nextRefresh);
    if (nextUser !== undefined && nextUser !== null)
      tokenService.setUser(nextUser);
    return {
      accessToken,
      refreshToken,
      user,
    };
  },

  clearAuth: () => {
    accessToken = null;
    refreshToken = null;
    user = null;
    Cookies.remove(REMEMBER_KEY, { path: "/" });
  },
};

export default tokenService;
