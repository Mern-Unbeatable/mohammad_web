/**
 * Admin users feature public API.
 *
 * - usersApi     → HTTP
 * - usersThunks  → async actions
 * - usersSlice   → state + sync reducers
 */

export { default as adminUsersReducer } from "./usersSlice";
export { clearUsersError, clearSelectedUser } from "./usersSlice";
export {
  fetchUsersList,
  fetchUserDetails,
  updateUserStatus,
} from "./usersThunks";
export * as usersApi from "./usersApi";
