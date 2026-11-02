import { createNotificationsThunks } from "@/features/notifications";
import * as notificationsApi from "./notificationsApi";

/** User notifications async thunks (`userNotifications/*`). */
const thunks = createNotificationsThunks({
  prefix: "userNotifications",
  role: "User",
  api: notificationsApi,
});

export const fetchUserNotifications = thunks.fetchNotifications;
export const fetchUserUnreadNotificationCount = thunks.fetchUnreadCount;
export const markUserNotificationRead = thunks.markRead;
export const markAllUserNotificationsRead = thunks.markAllRead;
export const removeUserNotification = thunks.remove;
