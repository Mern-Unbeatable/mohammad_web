import { createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationsApi from "./notificationsApi";

/**
 * Supplier notifications async thunks — orchestration only; HTTP in notificationsApi.
 */

export const fetchSupplierNotifications = createAsyncThunk(
  "supplierNotifications/fetchSupplierNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await notificationsApi.getNotifications(params);
    } catch (err) {
      return rejectWithValue(
        notificationsApi.getApiErrorMessage(
          err,
          "Failed to load notifications",
        ),
      );
    }
  },
);

/** Background badge refresh; touches only `notificationsMeta.unreadCount`. */
export const fetchSupplierUnreadNotificationCount = createAsyncThunk(
  "supplierNotifications/fetchSupplierUnreadNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsApi.getUnreadCount();
    } catch (err) {
      return rejectWithValue(
        notificationsApi.getApiErrorMessage(err, "Failed to load notifications"),
      );
    }
  },
);

export const markSupplierNotificationRead = createAsyncThunk(
  "supplierNotifications/markSupplierNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationsApi.markNotificationRead(notificationId);
      return { notificationId };
    } catch (err) {
      return rejectWithValue(
        notificationsApi.getApiErrorMessage(
          err,
          "Failed to mark notification as read",
        ),
      );
    }
  },
);

export const markAllSupplierNotificationsRead = createAsyncThunk(
  "supplierNotifications/markAllSupplierNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllNotificationsRead();
      return { ok: true };
    } catch (err) {
      return rejectWithValue(
        notificationsApi.getApiErrorMessage(
          err,
          "Failed to mark all notifications as read",
        ),
      );
    }
  },
);

export const removeSupplierNotification = createAsyncThunk(
  "supplierNotifications/removeSupplierNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      return await notificationsApi.deleteNotification(notificationId);
    } catch (err) {
      return rejectWithValue(
        notificationsApi.getApiErrorMessage(
          err,
          "Failed to delete notification",
        ),
      );
    }
  },
);
