import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const REMEMBER_KEY = "remember";

const isSecure = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const cookieOptions = (remember = true) => ({
  expires: remember ? 7 : undefined,
  secure: isSecure(),
  sameSite: "strict",
  path: "/",
});

const readJson = (key) => {
  const raw = Cookies.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const tokenService = {
  getToken: () => Cookies.get(ACCESS_TOKEN_KEY) || null,
  setToken: (token, remember = true) => {
    if (!token) {
      Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
      return;
    }
    Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions(remember));
  },

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY) || null,
  setRefreshToken: (token, remember = true) => {
    if (!token) {
      Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
      return;
    }
    Cookies.set(REFRESH_TOKEN_KEY, token, cookieOptions(remember));
  },

  getUser: () => readJson(USER_KEY),

  setUser: (user, remember = tokenService.getRemember()) => {
    if (!user) {
      Cookies.remove(USER_KEY, { path: "/" });
      return;
    }
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions(remember));
  },

  getRemember: () => Cookies.get(REMEMBER_KEY) !== "0",

  setRemember: (remember) => {
    Cookies.set(REMEMBER_KEY, remember ? "1" : "0", cookieOptions(true));
  },

  persistSession: ({
    accessToken,
    refreshToken,
    user,
    remember = true,
  } = {}) => {
    tokenService.setRemember(remember);
    if (accessToken) tokenService.setToken(accessToken, remember);
    if (refreshToken) tokenService.setRefreshToken(refreshToken, remember);
    if (user) tokenService.setUser(user, remember);
    return {
      accessToken: tokenService.getToken(),
      refreshToken: tokenService.getRefreshToken(),
      user: tokenService.getUser(),
    };
  },

  clearAuth: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
    Cookies.remove(REMEMBER_KEY, { path: "/" });
  },
};

export default tokenService;
