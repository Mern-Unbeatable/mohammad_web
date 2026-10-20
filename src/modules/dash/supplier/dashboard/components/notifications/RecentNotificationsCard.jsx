import { NotificationRowSkeleton } from "@/components/loader";
import Card from "@/components/ui/Card";
import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import NotificationItem from "./NotificationItem";
import {
  EMPTY_NOTIFICATIONS_MESSAGE,
  NOTIFICATION_SKELETON_COUNT,
  NOTIFICATIONS_PATH,
} from "../../constant/constants";

const RecentNotificationsCard = ({ notifications, loading }) => (
  <Card className="overflow-hidden">
    <SectionHeader
      title="Recent Notifications"
      subtitle="Latest updates about your advertisements"
      viewAllTo={NOTIFICATIONS_PATH}
      className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6"
    />

    {loading ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {Array.from({ length: NOTIFICATION_SKELETON_COUNT }, (_, i) => (
          <NotificationRowSkeleton key={i} />
        ))}
      </ul>
    ) : notifications.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </ul>
    ) : (
      <div className="px-5 py-8 sm:px-6">
        <EmptyState message={EMPTY_NOTIFICATIONS_MESSAGE} />
      </div>
    )}
  </Card>
);

export default RecentNotificationsCard;
