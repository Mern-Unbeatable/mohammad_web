import {
  BOTTOM_NAV_ACTIVE_PREFIX,
  FEED_PATH,
  NAV_ACTIVE_PREFIX,
} from '@/components/navigation/constant/constants';

const matches = (pathname, id, to, prefixes) => {
  if (id === 'home') return pathname === FEED_PATH;
  const prefix = prefixes[id];
  if (prefix) return pathname.startsWith(prefix);
  return pathname === to;
};

export const isNavItemActive = ({ id, to }, pathname) =>
  matches(pathname, id, to, NAV_ACTIVE_PREFIX);

export const isBottomTabActive = ({ id, to }, pathname) =>
  matches(pathname, id, to, BOTTOM_NAV_ACTIVE_PREFIX);
