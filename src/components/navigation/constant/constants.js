import {
  Bell,
  BookOpen,
  Briefcase,
  Home,
  LayoutGrid,
  MessageSquare,
  Package,
  SquarePlus,
  Store,
  Users,
} from 'lucide-react';
import { CHAT_BASE_PATHS } from '@/features/messages/chatPaths';

export const FEED_PATH = '/feed';
export const PROFILE_PATH = '/profile';
export const SUBSCRIPTION_PATH = '/subscription';
export const NOTIFICATIONS_PATH = '/notifications';
export const LOGIN_PATH = '/login';

/** Desktop navbar and mobile drawer links, in display order. */
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, to: FEED_PATH },
  { id: 'marketplace', label: 'Marketplace', icon: Store, to: '/marketplace' },
  { id: 'recruitment', label: 'Recruitment', icon: Briefcase, to: '/recruitment' },
  { id: 'general', label: 'General', icon: LayoutGrid, to: '/general' },
  { id: 'blogs', label: 'Blogs', icon: BookOpen, to: '/blogs' },
  { id: 'contacts', label: 'Contacts', icon: Users, to: '/contacts' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, to: '/chat' },
  { id: 'notifications', label: 'Notifications', icon: Bell, to: NOTIFICATIONS_PATH },
];

/** Nav items that stay active on nested routes; others match their `to` exactly. */
export const NAV_ACTIVE_PREFIX = {
  contacts: '/contacts',
  marketplace: '/marketplace',
  recruitment: '/recruitment',
  general: '/general',
  messages: CHAT_BASE_PATHS.USER,
  blogs: '/blogs',
  notifications: NOTIFICATIONS_PATH,
};

export const BOTTOM_NAV_TABS = [
  { id: 'home', label: 'Home', icon: Home, to: FEED_PATH },
  { id: 'network', label: 'Network', icon: Users, to: '/contacts' },
  { id: 'post', label: 'Post', icon: SquarePlus, action: 'create' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, to: CHAT_BASE_PATHS.USER },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, to: '/recruitment' },
];

export const BOTTOM_NAV_ACTIVE_PREFIX = {
  network: '/contacts',
  jobs: '/recruitment',
  messages: CHAT_BASE_PATHS.USER,
};

export const QUICK_LINKS = [
  { id: 'sell', label: 'Sell equipment', icon: Package, to: '/marketplace/create' },
  { id: 'job', label: 'Post a job', icon: Briefcase, to: '/recruitment/create' },
  { id: 'network', label: 'Grow your network', icon: Users, to: '/contacts' },
];

export const SEARCH_DEBOUNCE_MS = 350;
export const SEARCH_FETCH_LIMIT = 10;
export const ALL_TAB_GROUP_LIMIT = 5;

export const HOVER_OPEN_DELAY_MS = 120;
export const HOVER_CLOSE_DELAY_MS = 200;

export const NOTIFICATIONS_PREVIEW_LIMIT = 6;
/** Server maximum per page; the messages preview walks every page. */
export const CONVERSATIONS_PAGE_SIZE = 100;

export const SIDEBAR_LIMIT = 3;
/** Fetched before dropping existing connections, so enough suggestions remain. */
export const PEOPLE_FETCH_SIZE = 12;
export const DEFAULT_TRIAL_DAYS = 90;

export const AVATAR_ACCENT_CLASS = 'bg-[#FEF3C7] text-[#B45309]';

/** Public (marketing) navbar: in-page sections of the home page. */
export const PUBLIC_NAV_LINKS = [
  { label: 'Platform', sectionId: 'platform' },
  { label: 'Community', sectionId: 'community' },
  { label: 'Marketplace', sectionId: 'marketplace' },
];

/** Section the logo scrolls to when already on the home page. */
export const PUBLIC_TOP_SECTION = 'platform';

export const PUBLIC_PRIMARY_LINK_CLASS =
  'rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 xl:px-8 xl:py-3 xl:text-[15px]';
