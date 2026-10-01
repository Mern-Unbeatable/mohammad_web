import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { CardSkeleton } from "@/components/common/Skeleton";
import {
  fetchUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  clearNotificationsError,
  toNotificationListModel,
} from "@/features/user/notifications";
import { resolveNotificationLink } from "@/features/messages";
import { CHAT_BASE_PATHS } from "@/shared/constants/chat";

const NotificationItem = ({ item, onMarkRead }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onMarkRead(item)}
      className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F9FAFB] sm:px-6"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-snug text-deep-blue">
          {item.title}
        </p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
          {item.subtitle}
        </p>
        <p className="mt-2 text-[12px] text-[#98A2B3]">{item.time}</p>
      </div>

      {item.unread ? (
        <span
          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
          aria-label="Unread"
        />
      ) : null}
    </button>
  );
};

/**
 * Shared notifications list. When `items` is omitted, loads from user Redux.
 * Pass controlled `items` / handlers to keep a parent-driven UI.
 */
const NotificationsPageContent = ({
  items: controlledItems,
  loading: controlledLoading,
  onMarkRead: controlledMarkRead,
  onMarkAllRead: controlledMarkAllRead,
} = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.userNotifications);

  const isControlled = controlledItems != null;

  useEffect(() => {
    if (isControlled) return;
    dispatch(clearNotificationsError());
    dispatch(
      fetchUserNotifications({
        page: 1,
        pageSize: 30,
        sort: "desc",
      }),
    );
  }, [dispatch, isControlled]);

  useEffect(() => {
    if (!isControlled && error) toast.error(error);
  }, [error, isControlled]);

  const items = useMemo(() => {
    if (isControlled) return controlledItems;
    return (notifications || []).map(toNotificationListModel).filter(Boolean);
  }, [isControlled, controlledItems, notifications]);

  const isLoading = isControlled ? controlledLoading : loading;

  const handleMarkRead = async (item) => {
    if (controlledMarkRead) {
      controlledMarkRead(item);
      return;
    }
    if (item.unread) {
      await dispatch(markUserNotificationRead(item.id));
    }
    if (!item.link) return;
    const { to, failed } = await resolveNotificationLink(item.link, CHAT_BASE_PATHS.USER);
    if (failed) toast.error("That conversation is no longer available");
    navigate(to);
  };

  const handleMarkAllRead = async () => {
    if (controlledMarkAllRead) {
      controlledMarkAllRead();
      return;
    }
    if (actionLoading) return;
    const result = await dispatch(markAllUserNotificationsRead());
    if (markAllUserNotificationsRead.fulfilled.match(result)) {
      toast.success("All notifications marked as read");
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
          Notifications
        </h1>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={actionLoading}
          className="shrink-0 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
        >
          Mark all as read
        </button>
      </div>

      {isLoading && items.length === 0 ? (
        <CardSkeleton
          variant="notification"
          count={6}
          as="ul"
          className="divide-y divide-[#E4E7EC]"
        />
      ) : items.length === 0 ? (
        <p className="px-5 py-10 text-center text-[14px] text-[#64748B]">
          No notifications yet.
        </p>
      ) : (
        <ul className="divide-y divide-[#E4E7EC]">
          {items.map((item) => (
            <li key={item.id}>
              <NotificationItem item={item} onMarkRead={handleMarkRead} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default NotificationsPageContent;
