import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

/** Session cookie (no Expires) when remember is false */
const REMEMBER_ACCESS_DAYS = 7;
const REMEMBER_REFRESH_DAYS = 30;
const REMEMBER_USER_DAYS = 7;

const baseCookieOptions = () => ({
  secure: window.location.protocol === 'https:',
  sameSite: 'Strict',
});

/**
 * Token Service handles reading, writing, and removing authentication tokens in Cookies.
 *
 * Note: Prefer server-set HttpOnly cookies for access/refresh tokens when the API supports
 * them. Until then, tokens remain in JS-readable cookies for Bearer auth.
 */
export const tokenService = {
  getToken: () => Cookies.get(TOKEN_KEY) || null,

  /**
   * @param {string} token
   * @param {{ remember?: boolean, expires?: number }} [options]
   *   remember=true → persistent cookie; remember=false → session cookie
   */
  setToken: (token, options = {}) => {
    const { remember = true, expires } = options;
    const cookieOptions = { ...baseCookieOptions() };

    if (typeof expires === 'number') {
      cookieOptions.expires = expires;
    } else if (remember) {
      cookieOptions.expires = REMEMBER_ACCESS_DAYS;
    }

    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY) || null,

  /**
   * @param {string} refreshToken
   * @param {{ remember?: boolean, expires?: number }} [options]
   */
  setRefreshToken: (refreshToken, options = {}) => {
    const { remember = true, expires } = options;
    const cookieOptions = { ...baseCookieOptions() };

    if (typeof expires === 'number') {
      cookieOptions.expires = expires;
    } else if (remember) {
      cookieOptions.expires = REMEMBER_REFRESH_DAYS;
    }

    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  getUser: () => {
    const user = Cookies.get(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * @param {object} userData
   * @param {{ remember?: boolean, expires?: number }} [options]
   */
  setUser: (userData, options = {}) => {
    const { remember = true, expires } = options;
    const cookieOptions = { ...baseCookieOptions() };

    if (typeof expires === 'number') {
      cookieOptions.expires = expires;
    } else if (remember) {
      cookieOptions.expires = REMEMBER_USER_DAYS;
    }

    Cookies.set(USER_KEY, JSON.stringify(userData), cookieOptions);
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export default tokenService;
