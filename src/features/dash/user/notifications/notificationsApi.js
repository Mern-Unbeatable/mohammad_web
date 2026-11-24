import { API_ENDPOINTS, getApiErrorMessage } from "@/config";
import { createNotificationsApi } from "@/features/notifications";

/** User notifications HTTP helpers — no Redux. Used by notificationsThunks. */
export const {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = createNotificationsApi(API_ENDPOINTS.USER.NOTIFICATIONS);

export { getApiErrorMessage };
