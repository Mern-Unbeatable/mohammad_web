import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Notifications async thunks for one role. Action types keep the existing
 * per-role names, e.g. `userNotifications/fetchUserNotifications`:
 * `prefix` is the slice name, `role` the capitalised word in each thunk name.
 * `api` is read at call time so tests can mock the role's notificationsApi.
 */
export function createNotificationsThunks({ prefix, role, api }) {
  const fetchNotifications = createAsyncThunk(
    `${prefix}/fetch${role}Notifications`,
    async (params = {}, { rejectWithValue }) => {
      try {
        return await api.getNotifications(params);
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to load notifications"),
        );
      }
    },
  );

  /** Background badge refresh; touches only `notificationsMeta.unreadCount`. */
  const fetchUnreadCount = createAsyncThunk(
    `${prefix}/fetch${role}UnreadNotificationCount`,
    async (_, { rejectWithValue }) => {
      try {
        return await api.getUnreadCount();
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to load notifications"),
        );
      }
    },
  );

  const markRead = createAsyncThunk(
    `${prefix}/mark${role}NotificationRead`,
    async (notificationId, { rejectWithValue }) => {
      try {
        await api.markNotificationRead(notificationId);
        return { notificationId };
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to mark notification as read"),
        );
      }
    },
  );

  const markAllRead = createAsyncThunk(
    `${prefix}/markAll${role}NotificationsRead`,
    async (_, { rejectWithValue }) => {
      try {
        await api.markAllNotificationsRead();
        return { ok: true };
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to mark all notifications as read"),
        );
      }
    },
  );

  const remove = createAsyncThunk(
    `${prefix}/remove${role}Notification`,
    async (notificationId, { rejectWithValue }) => {
      try {
        return await api.deleteNotification(notificationId);
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to delete notification"),
        );
      }
    },
  );

  return { fetchNotifications, fetchUnreadCount, markRead, markAllRead, remove };
}
