import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { fetchUnreadSummary } from "./messagesThunks";
import { useMessagesSocket } from "./realtime";

/**
 * Lets an open conversation's `message:new` → mark-read round trip settle
 * before re-counting, so the badge does not flash.
 */
const REFRESH_DEBOUNCE_MS = 400;

/**
 * Account-wide unread message totals for nav badges, kept in sync with the
 * server across refreshes, route changes, tabs and realtime events.
 * Mount once per layout shell.
 */
export function useUnreadMessages() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const unread = useSelector((state) => state.messages.unread);
  const timerRef = useRef(null);

  const refresh = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => dispatch(fetchUnreadSummary()),
      REFRESH_DEBOUNCE_MS,
    );
  }, [dispatch]);

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
    "message:new": ({ message } = {}) => {
      if (message?.senderId !== currentUserId) refresh();
    },
    "message:deleted": refresh,
    "conversation:new": refresh,
    "conversation:removed": refresh,
    "conversation:read": ({ userId } = {}) => {
      if (userId === currentUserId) refresh();
    },
  });

  return {
    messages: unread.messages,
    conversations: unread.conversations,
    hasUnread: unread.conversations > 0,
  };
}
