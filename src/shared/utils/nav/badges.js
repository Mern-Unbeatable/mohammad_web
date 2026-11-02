/** "1 unread notification" / "3 unread notifications". */
export const countLabel = (count, phrase) => `${count} ${phrase}${count === 1 ? '' : 's'}`;

export const buildNavBadges = ({ pendingRequests, newApplications, unreadChats, unreadNotifications }) => ({
  contacts: {
    count: pendingRequests,
    label: countLabel(pendingRequests, 'pending connection request'),
  },
  recruitment: {
    count: newApplications,
    label: countLabel(newApplications, 'new job application'),
  },
  messages: {
    count: unreadChats,
    label: countLabel(unreadChats, 'unread conversation'),
  },
  notifications: {
    count: unreadNotifications,
    label: countLabel(unreadNotifications, 'unread notification'),
  },
});

/** Badges announced on the mobile menu button, in reading order. */
const MENU_ALERT_IDS = ['messages', 'contacts', 'recruitment'];

export const hasMenuAlerts = (badges) => MENU_ALERT_IDS.some((id) => badges[id].count);

export const menuToggleLabel = (open, badges) => {
  if (open) return 'Close menu';
  if (!hasMenuAlerts(badges)) return 'Open menu';
  const alerts = MENU_ALERT_IDS.filter((id) => badges[id].count).map((id) => badges[id].label);
  return `Open menu, ${alerts.join(', ')}`;
};
