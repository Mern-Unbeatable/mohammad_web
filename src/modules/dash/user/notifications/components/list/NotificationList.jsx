import { CardSkeleton } from '@/components/loader';
import { NOTIFICATIONS_SKELETON_COUNT } from '../../constant/constants';
import NotificationItem from './NotificationItem';

/** Skeleton on first load, empty text, or the notification rows. */
const NotificationList = ({ items, loading, onOpen }) => {
  if (loading && items.length === 0) {
    return (
      <CardSkeleton
        variant="notification"
        count={NOTIFICATIONS_SKELETON_COUNT}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    );
  }

  if (items.length === 0) {
    return <p className="px-5 py-10 text-center text-[14px] text-[#64748B]">No notifications yet.</p>;
  }

  return (
    <ul className="divide-y divide-[#E4E7EC]">
      {items.map((item) => (
        <li key={item.id}>
          <NotificationItem item={item} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
