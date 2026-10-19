import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { CardSkeleton } from "@/components/common/Skeleton";
import {
  markUserNotificationRead,
  notificationsApi,
  toNotificationListModel,
} from "@/features/user/notifications";
import { resolveNotificationLink } from "@/features/messages";
import { CHAT_BASE_PATHS } from "@/shared/constants/chat";
import NavHoverMenu from "./NavHoverMenu";

const PREVIEW_LIMIT = 6;

const PreviewItem = ({ item, onOpen }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F9FAFB]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[13px] font-semibold text-deep-blue">
          {item.title}
        </p>
        {item.subtitle ? (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#64748B]">
            {item.subtitle}
          </p>
        ) : null}
        <p className="mt-1 text-[11px] text-[#98A2B3]">{item.time}</p>
      </div>
      {item.unread ? (
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
          aria-label="Unread"
        />
      ) : null}
    </button>
  );
};

/** Latest notifications on hover; the wrapped link still opens the full page. */
const NotificationsHoverMenu = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  const loadPreview = async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const { data } = await notificationsApi.getNotifications({
        page: 1,
        pageSize: PREVIEW_LIMIT,
        sort: "desc",
      });
      if (requestId !== requestRef.current) return;
      setItems((data || []).map(toNotificationListModel).filter(Boolean));
    } catch (err) {
      if (requestId === requestRef.current) {
        toast.error(
          notificationsApi.getApiErrorMessage(err, "Failed to load notifications"),
        );
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  const openItem = async (item) => {
    if (item.unread) {
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, unread: false } : row)),
      );
      dispatch(markUserNotificationRead(item.id));
    }
    if (!item.link) {
      navigate("/notifications");
      return;
    }
    const { to, failed } = await resolveNotificationLink(
      item.link,
      CHAT_BASE_PATHS.USER,
    );
    if (failed) toast.error("That conversation is no longer available");
    navigate(to);
  };

  return (
    <NavHoverMenu
      title="Notifications"
      footerLabel="See all notifications"
      footerTo="/notifications"
      onOpen={loadPreview}
      body={
        loading && items.length === 0 ? (
          <CardSkeleton
            variant="notification"
            count={3}
            as="ul"
            className="divide-y divide-[#E4E7EC]"
          />
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-[#64748B]">
            No notifications yet.
          </p>
        ) : (
          <ul className="divide-y divide-[#E4E7EC]">
            {items.map((item) => (
              <li key={item.id}>
                <PreviewItem item={item} onOpen={openItem} />
              </li>
            ))}
          </ul>
        )
      }
    >
      {children}
    </NavHoverMenu>
  );
};

export default NotificationsHoverMenu;
