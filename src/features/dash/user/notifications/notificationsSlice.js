import { createNotificationsSlice } from "@/features/notifications";
import {
  fetchUserNotifications,
  fetchUserUnreadNotificationCount,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  removeUserNotification,
} from "./notificationsThunks";

const notificationsSlice = createNotificationsSlice({
  name: "userNotifications",
  thunks: {
    fetchNotifications: fetchUserNotifications,
    fetchUnreadCount: fetchUserUnreadNotificationCount,
    markRead: markUserNotificationRead,
    markAllRead: markAllUserNotificationsRead,
    remove: removeUserNotification,
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;

export const selectUserUnreadNotificationCount = notificationsSlice.selectUnreadCount;
export default notificationsSlice.reducer;
