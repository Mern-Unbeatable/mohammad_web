import { createNotificationsThunks } from "@/features/notifications";
import * as notificationsApi from "./notificationsApi";

/** Supplier notifications async thunks (`supplierNotifications/*`). */
const thunks = createNotificationsThunks({
  prefix: "supplierNotifications",
  role: "Supplier",
  api: notificationsApi,
});

export const fetchSupplierNotifications = thunks.fetchNotifications;
export const fetchSupplierUnreadNotificationCount = thunks.fetchUnreadCount;
export const markSupplierNotificationRead = thunks.markRead;
export const markAllSupplierNotificationsRead = thunks.markAllRead;
export const removeSupplierNotification = thunks.remove;
