import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  removeUserNotification,
  fetchUserUnreadNotificationCount,
} from "./notificationsThunks";
import { logoutUser } from "../../auth/authThunks";

const initialState = {
  notifications: [],
  notificationsMeta: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
    unreadCount: 0,
  },
  loading: false,
  actionLoading: false,
  error: null,
  /** Latest badge refresh; older responses must not overwrite newer counts. */
  unreadRequestId: null,
};

const notificationsSlice = createSlice({
  name: "userNotifications",
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.notificationsMeta = action.payload.meta;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markUserNotificationRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markUserNotificationRead.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { notificationId } = action.payload;
        state.notifications = state.notifications.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item,
        );
        if (state.notificationsMeta.unreadCount > 0) {
          state.notificationsMeta.unreadCount -= 1;
        }
      })
      .addCase(markUserNotificationRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(markAllUserNotificationsRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markAllUserNotificationsRead.fulfilled, (state) => {
        state.actionLoading = false;
        state.notifications = state.notifications.map((item) => ({
          ...item,
          read: true,
        }));
        state.notificationsMeta.unreadCount = 0;
      })
      .addCase(markAllUserNotificationsRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(removeUserNotification.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(removeUserNotification.fulfilled, (state, action) => {
        state.actionLoading = false;
        const removed = state.notifications.find(
          (item) => item.id === action.payload.notificationId,
        );
        state.notifications = state.notifications.filter(
          (item) => item.id !== action.payload.notificationId,
        );
        if (removed && !removed.read && state.notificationsMeta.unreadCount > 0) {
          state.notificationsMeta.unreadCount -= 1;
        }
      })
      .addCase(removeUserNotification.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserUnreadNotificationCount.pending, (state, action) => {
        state.unreadRequestId = action.meta.requestId;
      })
      .addCase(fetchUserUnreadNotificationCount.fulfilled, (state, action) => {
        if (state.unreadRequestId !== action.meta.requestId) return;
        state.notificationsMeta.unreadCount = action.payload;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState);
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;

export const selectUserUnreadNotificationCount = (state) =>
  state.userNotifications.notificationsMeta.unreadCount ?? 0;
export default notificationsSlice.reducer;
