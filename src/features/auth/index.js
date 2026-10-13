/**
 * Auth feature public API.
 *
 * - authApi     → HTTP
 * - authThunks  → async actions
 * - authSlice   → state + sync reducers
 */

export { default as authReducer } from "./authSlice";
export {
  resetAuth,
  clearError,
  setSessionReady,
  tokenRefreshed,
  setUser,
} from "./authSlice";
export {
  loginUser,
  registerUser,
  fetchUserProfile,
  refreshSession,
  logoutUser,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "./authThunks";
export * as authApi from "./authApi";
