import { createNotificationsSlice } from "@/features/notifications";
import {
  fetchSupplierNotifications,
  fetchSupplierUnreadNotificationCount,
  markSupplierNotificationRead,
  markAllSupplierNotificationsRead,
  removeSupplierNotification,
} from "./notificationsThunks";

const notificationsSlice = createNotificationsSlice({
  name: "supplierNotifications",
  thunks: {
    fetchNotifications: fetchSupplierNotifications,
    fetchUnreadCount: fetchSupplierUnreadNotificationCount,
    markRead: markSupplierNotificationRead,
    markAllRead: markAllSupplierNotificationsRead,
    remove: removeSupplierNotification,
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;

export const selectSupplierUnreadNotificationCount = notificationsSlice.selectUnreadCount;
export default notificationsSlice.reducer;
