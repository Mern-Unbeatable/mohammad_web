import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useMessagesSocket } from "@/features/messages";

/** Coalesces bursts (e.g. several notifications created in one request). */
const REFRESH_DEBOUNCE_MS = 400;

/**
 * Unread notification count for a nav badge, kept in sync with the server on
 * mount, route changes, tab focus, socket reconnects and realtime
 * `notification:new` / `notification:updated` events. Mount once per shell.
 *
 * @param {{ fetchCount: () => unknown, selectCount: (state: object) => number }} source
 *   a role's count-only thunk and its `notificationsMeta.unreadCount` selector
 *   (both must be stable references).
 */
export function useNotificationBadge({ fetchCount, selectCount }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const count = useSelector(selectCount);
  const timerRef = useRef(null);

  const refresh = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => dispatch(fetchCount()), REFRESH_DEBOUNCE_MS);
  }, [dispatch, fetchCount]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (currentUserId) refresh();
  }, [currentUserId, pathname, refresh]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  useMessagesSocket({
    connect: refresh,
    "notification:new": refresh,
    "notification:updated": refresh,
  });

  return count > 0 ? count : 0;
}
