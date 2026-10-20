import { Bell } from "lucide-react";
import { CardSkeleton } from "@/components/loader";
import { NOTIFICATIONS_PATH } from "../../constant/constants";
import { useNotificationsPreview } from "../../hooks/useNotificationsPreview";
import NavHoverMenu from "./NavHoverMenu";
import NotificationPreviewItem from "./NotificationPreviewItem";
import PreviewEmpty from "./PreviewEmpty";

/** Latest notifications on hover; the wrapped link still opens the full page. */
const NotificationsHoverMenu = ({ children }) => {
  const { items, loading, loadPreview, openItem } = useNotificationsPreview();

  return (
    <NavHoverMenu
      title="Notifications"
      icon={Bell}
      footerLabel="See all notifications"
      footerTo={NOTIFICATIONS_PATH}
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
          <PreviewEmpty>No notifications yet.</PreviewEmpty>
        ) : (
          <ul className="divide-y divide-[#E4E7EC]">
            {items.map((item) => (
              <li key={item.id}>
                <NotificationPreviewItem item={item} onOpen={openItem} />
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
