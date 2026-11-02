import { API_ENDPOINTS, getApiErrorMessage } from "@/config";
import { createNotificationsApi } from "@/features/notifications";

/** Supplier notifications HTTP helpers — no Redux. Used by notificationsThunks. */
export const {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = createNotificationsApi(API_ENDPOINTS.SUPPLIER.NOTIFICATIONS);

export { getApiErrorMessage };
