import { API_ENDPOINTS } from "@/api/httpEndpoints";
import { tokenService } from "@/api/cookies";
import { unwrapApiData, unwrapUser } from "@/api/unwrapApiData";
import { getApiErrorMessage } from "@/api/httpError";
import axiosInstance, { bareAuthClient } from "@/api/axiosInstance";

/**
 * Auth HTTP helpers — no Redux. Used by thunks.
 * Matches Postman folder "🔐 Auth" (+ change password).
 */

const toError = (error, fallback) => {
  const payload =
    error?.response?.data?.error || error?.response?.data || error;
  const message =
    payload?.message ||
    (typeof payload === "string" ? payload : null) ||
    error?.message ||
    fallback;
  const details = payload?.details || error?.response?.data?.errors || null;
  const err = new Error(message);
  err.status = error?.response?.status || error?.status || 500;
  err.details = details;
  err.code = payload?.code || null;
  err.raw = error;
  return err;
};

// ═══════════════════════════════════════════════════════════════════════
// Register
// ═══════════════════════════════════════════════════════════════════════
export async function register(input, options = {}) {
  const remember = options.remember ?? true;
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, input);
  const data = unwrapApiData(response) || response;
  const user = unwrapUser(data);
  const session = tokenService.persistSession({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    user,
    remember,
  });
  return { ...data, ...session, user };
}

// ═══════════════════════════════════════════════════════════════════════
// Login
// ═══════════════════════════════════════════════════════════════════════
export async function login(credentials) {
  const { remember = true, ...body } = credentials || {};
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
    ...body,
    remember,
  });
  const data = unwrapApiData(response) || response;
  const user = unwrapUser(data);
  const session = tokenService.persistSession({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    user,
    remember,
  });
  return { ...data, ...session, user };
}

// ═══════════════════════════════════════════════════════════════════════
// Refresh
// ═══════════════════════════════════════════════════════════════════════
export async function refresh(refreshToken = tokenService.getRefreshToken()) {
  if (!refreshToken) {
    throw toError({ message: "No refresh token" }, "No refresh token");
  }

  try {
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
    return { ...data, ...session };
  } catch (error) {
    throw toError(error, "Failed to refresh session");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Logout
// ═══════════════════════════════════════════════════════════════════════
export async function logout() {
  const refreshToken = tokenService.getRefreshToken();
  try {
    if (refreshToken) {
      await bareAuthClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    }
    return { ok: true };
  } catch (error) {
    throw toError(error, "Logout failed");
  } finally {
    tokenService.clearAuth();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Forgot / reset password
// ═══════════════════════════════════════════════════════════════════════
export async function forgotPassword(email) {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    email,
  });
  return unwrapApiData(response) ?? response;
}

export async function verifyResetToken(token) {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN,
    { token },
  );
  return unwrapApiData(response) ?? response;
}

export async function resetPassword({ token, password, confirmPassword }) {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token,
    password,
    confirmPassword,
  });
  return unwrapApiData(response) ?? response;
}

// ═══════════════════════════════════════════════════════════════════════
// Me (current user)
// ═══════════════════════════════════════════════════════════════════════
export async function me() {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
  const user = unwrapUser(response);
  if (!user) {
    throw toError(
      { message: "Invalid profile response" },
      "Invalid profile response",
    );
  }
  tokenService.setUser(user);
  return user;
}

// ═══════════════════════════════════════════════════════════════════════
// Change password
// ═══════════════════════════════════════════════════════════════════════
export async function changePassword(input) {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.USER.PROFILE.CHANGE_PASSWORD,
    input,
  );
  return unwrapApiData(response) ?? response;
}

export { getApiErrorMessage };
