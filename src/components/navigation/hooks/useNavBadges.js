import { useUnreadMessages } from '@/features/messages';
import {
  fetchUserUnreadNotificationCount,
  selectUserUnreadNotificationCount,
} from '@/features/user/notifications';
import { fetchPendingRequestCount, selectPendingRequestCount } from '@/features/user/contacts';
import { fetchNewApplicationCounts, selectNewApplicationTotal } from '@/features/user/recruitment';
import { useNotificationBadge } from '@/shared/hooks/useNotificationBadge';
import { buildNavBadges } from '../utils/badges';

const userNotificationBadge = {
  fetchCount: fetchUserUnreadNotificationCount,
  selectCount: selectUserUnreadNotificationCount,
};

// Connection requests create a notification, so the same realtime events apply.
const pendingRequestsBadge = {
  fetchCount: fetchPendingRequestCount,
  selectCount: selectPendingRequestCount,
};

// Applying to a job notifies its owner, so this refreshes on the same events.
const newApplicationsBadge = {
  fetchCount: fetchNewApplicationCounts,
  selectCount: selectNewApplicationTotal,
};

/**
 * Live counts for the navbar. Also keeps the notification and request counts
 * fresh for `MobileBottomNav`, which only reads them from the store.
 */
export function useNavBadges() {
  const { conversations: unreadChats } = useUnreadMessages();
  const unreadNotifications = useNotificationBadge(userNotificationBadge);
  const pendingRequests = useNotificationBadge(pendingRequestsBadge);
  const newApplications = useNotificationBadge(newApplicationsBadge);
  const badges = buildNavBadges({
    pendingRequests,
    newApplications,
    unreadChats,
    unreadNotifications,
  });

  return {
    badges,
    unreadChats,
    badgeFor: (id) => badges[id]?.count ?? 0,
    badgeLabelFor: (id) => badges[id]?.label,
  };
}
