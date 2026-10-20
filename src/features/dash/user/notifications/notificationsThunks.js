import { createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationsApi from "./notificationsApi";

/**
 * User notifications async thunks — orchestration only; HTTP in notificationsApi.
 */

export const fetchUserNotifications = createAsyncThunk(
  "userNotifications/fetchUserNotifications",
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
export const fetchUserUnreadNotificationCount = createAsyncThunk(
  "userNotifications/fetchUserUnreadNotificationCount",
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

export const markUserNotificationRead = createAsyncThunk(
  "userNotifications/markUserNotificationRead",
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

export const markAllUserNotificationsRead = createAsyncThunk(
  "userNotifications/markAllUserNotificationsRead",
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

export const removeUserNotification = createAsyncThunk(
  "userNotifications/removeUserNotification",
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
