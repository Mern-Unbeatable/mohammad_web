/**
 * User notifications feature public API.
 *
 * - notificationsApi     → HTTP
 * - notificationsThunks  → async actions
 * - notificationsSlice   → state + sync reducers
 * - notificationsMappers → list UI models
 */

export { default as userNotificationsReducer } from "./notificationsSlice";
export {
  clearNotificationsError,
  selectUserUnreadNotificationCount,
} from "./notificationsSlice";
export {
  fetchUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  removeUserNotification,
  fetchUserUnreadNotificationCount,
} from "./notificationsThunks";
export {
  toNotificationListModel,
  toUserLink,
} from "./notificationsMappers";
export * as notificationsApi from "./notificationsApi";
