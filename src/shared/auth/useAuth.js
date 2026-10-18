import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchUserProfile,
  refreshSession,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  clearError,
} from "@/features/auth";
import { normalizeAppRole, roleHomePath } from "@/shared/constants/roles";

/**
 * Auth hook — mirrors Postman Auth flow:
 * login / register / refresh / logout / me / changePassword /
 * forgotPassword / resetPassword
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, sessionReady, token, loggingOut } =
    useSelector((state) => state.auth);

  const role = normalizeAppRole(user);
  const homePath = role ? roleHomePath(role) : "/login";

  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(resultAction)) {
      const userPayload = resultAction.payload?.user;
      const userRole = normalizeAppRole(userPayload);
      return {
        ok: true,
        user: userPayload,
        role: userRole,
        redirectTo: userRole ? roleHomePath(userRole) : "/login",
      };
    }

    const details = resultAction.meta?.details;
    const suspension =
      details?.accountStatus === "SUSPENDED"
        ? {
            reason: details.suspensionReason || null,
            suspendedAt: details.suspendedAt || null,
          }
        : null;

    return {
      ok: false,
      error: resultAction.payload || "Invalid email or password.",
      suspension,
    };
  };

  const register = async (formData) => {
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      const userPayload = resultAction.payload?.user;
      const userRole = normalizeAppRole(userPayload);
      return {
        ok: true,
        user: userPayload,
        role: userRole,
        redirectTo: userRole ? roleHomePath(userRole) : "/login",
      };
    }

    return {
      ok: false,
      error: resultAction.payload || "Registration failed.",
    };
  };

  /** Resolves once the session is cleared; callers navigate afterwards. Repeat clicks are ignored. */
  const logout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (resultAction.meta?.condition) return false;
    toast.info("Logged out successfully");
    return true;
  };

  const refresh = async () => {
    const resultAction = await dispatch(refreshSession());
    if (refreshSession.fulfilled.match(resultAction)) {
      return { ok: true, ...resultAction.payload };
    }
    return { ok: false, error: resultAction.payload || "Session expired." };
  };

  const fetchProfile = async () => {
    const resultAction = await dispatch(fetchUserProfile());
    if (fetchUserProfile.fulfilled.match(resultAction)) {
      return { ok: true, user: resultAction.payload };
    }
    return {
      ok: false,
      error: resultAction.payload || "Failed to load profile.",
    };
  };

  const updatePassword = async (input) => {
    const resultAction = await dispatch(changePassword(input));
    if (changePassword.fulfilled.match(resultAction)) {
      toast.success("Password updated");
      return { ok: true };
    }
    const message = resultAction.payload || "Failed to change password.";
    toast.error(message);
    return { ok: false, error: message };
  };

  const requestPasswordReset = async (email) => {
    const resultAction = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(resultAction)) {
      return { ok: true, message: resultAction.payload?.message };
    }
    return {
      ok: false,
      error: resultAction.payload || "Failed to send reset link.",
    };
  };

  const checkResetToken = async (resetToken) => {
    const resultAction = await dispatch(verifyResetToken(resetToken));
    if (verifyResetToken.fulfilled.match(resultAction)) {
      return { ok: true, expiresAt: resultAction.payload?.expiresAt };
    }
    return {
      ok: false,
      status: resultAction.meta?.status ?? null,
      error: resultAction.payload || "Could not check this reset link.",
    };
  };

  const confirmPasswordReset = async (input) => {
    const resultAction = await dispatch(resetPassword(input));
    if (resetPassword.fulfilled.match(resultAction)) {
      return { ok: true, message: resultAction.payload?.message };
    }
    return {
      ok: false,
      status: resultAction.meta?.status ?? null,
      error: resultAction.payload || "Failed to reset password.",
    };
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(isAuthenticated && user && role),
    loading,
    error,
    sessionReady: Boolean(sessionReady),
    loggingOut: Boolean(loggingOut),
    role,
    login,
    register,
    logout,
    refresh,
    fetchProfile,
    changePassword: updatePassword,
    forgotPassword: requestPasswordReset,
    verifyResetToken: checkResetToken,
    resetPassword: confirmPasswordReset,
    clearError: () => dispatch(clearError()),
    homePath,
    isUser: role === "USER",
    isAdmin: role === "ADMIN",
    isSupplier: role === "SUPPLIER",
  };
};

export default useAuth;
