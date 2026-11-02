import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "@/features/auth/authThunks";

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

/** Notifications slice for one role; `name` is the store key (e.g. `userNotifications`). */
export function createNotificationsSlice({ name, thunks }) {
  const { fetchNotifications, fetchUnreadCount, markRead, markAllRead, remove } = thunks;

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      clearNotificationsError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchNotifications.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchNotifications.fulfilled, (state, action) => {
          state.loading = false;
          state.notifications = action.payload.data;
          state.notificationsMeta = action.payload.meta;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(markRead.pending, (state) => {
          state.actionLoading = true;
        })
        .addCase(markRead.fulfilled, (state, action) => {
          state.actionLoading = false;
          const { notificationId } = action.payload;
          state.notifications = state.notifications.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item,
          );
          if (state.notificationsMeta.unreadCount > 0) {
            state.notificationsMeta.unreadCount -= 1;
          }
        })
        .addCase(markRead.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        })
        .addCase(markAllRead.pending, (state) => {
          state.actionLoading = true;
        })
        .addCase(markAllRead.fulfilled, (state) => {
          state.actionLoading = false;
          state.notifications = state.notifications.map((item) => ({
            ...item,
            read: true,
          }));
          state.notificationsMeta.unreadCount = 0;
        })
        .addCase(markAllRead.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        })
        .addCase(remove.pending, (state) => {
          state.actionLoading = true;
        })
        .addCase(remove.fulfilled, (state, action) => {
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
        .addCase(remove.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        })
        .addCase(fetchUnreadCount.pending, (state, action) => {
          state.unreadRequestId = action.meta.requestId;
        })
        .addCase(fetchUnreadCount.fulfilled, (state, action) => {
          if (state.unreadRequestId !== action.meta.requestId) return;
          state.notificationsMeta.unreadCount = action.payload;
        })
        .addCase(logoutUser.fulfilled, () => initialState)
        .addCase(logoutUser.rejected, () => initialState);
    },
  });

  const selectUnreadCount = (state) =>
    state[name].notificationsMeta.unreadCount ?? 0;

  return { reducer: slice.reducer, actions: slice.actions, selectUnreadCount };
}
