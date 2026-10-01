import { describe, expect, it, vi } from "vitest";
import reducer, { selectUserUnreadNotificationCount } from "./notificationsSlice";
import {
  fetchUserNotifications,
  fetchUserUnreadNotificationCount,
  markAllUserNotificationsRead,
  markUserNotificationRead,
} from "./notificationsThunks";
import { logoutUser } from "../../auth/authThunks";

vi.mock("./notificationsApi", () => ({ getApiErrorMessage: (_err, fallback) => fallback }));

const initial = reducer(undefined, { type: "@@init" });
const count = (state) => selectUserUnreadNotificationCount({ userNotifications: state });

describe("user notifications unread badge", () => {
  it("applies only the latest count refresh and leaves the list alone", () => {
    let state = reducer(
      initial,
      fetchUserNotifications.fulfilled(
        { data: [{ id: "n1", read: false }], meta: { ...initial.notificationsMeta, unreadCount: 1 } },
        "list",
      ),
    );
    state = reducer(state, fetchUserUnreadNotificationCount.pending("old"));
    state = reducer(state, fetchUserUnreadNotificationCount.pending("new"));
    state = reducer(state, fetchUserUnreadNotificationCount.fulfilled(7, "old"));
    expect(count(state)).toBe(1);
    state = reducer(state, fetchUserUnreadNotificationCount.fulfilled(3, "new"));
    expect(count(state)).toBe(3);
    expect(state.notifications).toEqual([{ id: "n1", read: false }]);
    expect(state.loading).toBe(false);
  });

  it("does not surface badge refresh failures as a page error", () => {
    const state = reducer(
      initial,
      fetchUserUnreadNotificationCount.rejected(null, "req", undefined, "Failed"),
    );
    expect(state.error).toBeNull();
  });

  it("drops the badge as notifications are read", () => {
    let state = reducer(initial, fetchUserUnreadNotificationCount.pending("r"));
    state = reducer(state, fetchUserUnreadNotificationCount.fulfilled(2, "r"));
    state = reducer(state, markUserNotificationRead.fulfilled({ notificationId: "n1" }, "m", "n1"));
    expect(count(state)).toBe(1);
    state = reducer(state, markAllUserNotificationsRead.fulfilled({ ok: true }, "a"));
    expect(count(state)).toBe(0);
  });

  it("clears the count on logout", () => {
    let state = reducer(initial, fetchUserUnreadNotificationCount.pending("r"));
    state = reducer(state, fetchUserUnreadNotificationCount.fulfilled(4, "r"));
    state = reducer(state, logoutUser.fulfilled(undefined, "out"));
    expect(count(state)).toBe(0);
  });
});
