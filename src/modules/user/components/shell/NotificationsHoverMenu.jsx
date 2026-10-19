import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { CardSkeleton } from "@/components/common/Skeleton";
import {
  markUserNotificationRead,
  notificationsApi,
  toNotificationListModel,
} from "@/features/user/notifications";
import { resolveNotificationLink } from "@/features/messages";
import { CHAT_BASE_PATHS } from "@/shared/constants/chat";

const PREVIEW_LIMIT = 6;
const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 200;

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

/** Hover/focus preview of the latest notifications around the navbar link. */
const NotificationsHoverMenu = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

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

  const show = () => {
    clearTimeout(timerRef.current);
    if (open) return;
    timerRef.current = setTimeout(() => {
      setOpen(true);
      loadPreview();
    }, OPEN_DELAY_MS);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const close = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  const handleOpenItem = async (item) => {
    close();
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
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
      onClick={(event) => {
        if (event.target.closest("a")) close();
      }}
    >
      {children}

      {open ? (
        <div
          role="dialog"
          aria-label="Recent notifications"
          className="absolute right-0 top-[calc(100%+8px)] z-[80] w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-3">
            <p className="text-[15px] font-bold text-deep-blue">Notifications</p>
          </div>

          <div className="max-h-[min(420px,calc(100dvh-10rem))] overflow-y-auto overscroll-contain">
            {loading && items.length === 0 ? (
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
                    <PreviewItem item={item} onOpen={handleOpenItem} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/notifications"
            onClick={close}
            className="block border-t border-[#E4E7EC] px-4 py-2.5 text-center text-[13px] font-semibold text-primary hover:bg-[#F9FAFB]"
          >
            See all notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationsHoverMenu;
