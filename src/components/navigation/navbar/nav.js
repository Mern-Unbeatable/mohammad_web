import {
  BarChart3,
  Bell,
  Briefcase,
  FileText,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Newspaper,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User,
  Users,
} from 'lucide-react';

export const supplierNavItems = [
  { to: '/supplier', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/supplier/ads', label: 'My Ads', icon: Megaphone },
  { to: '/supplier/payments', label: 'Payments', icon: Receipt },
  { to: '/supplier/contacts', label: 'Contacts', icon: Users },
  { to: '/supplier/recruitment', label: 'Recruitment', icon: Briefcase, badge: 'newApplications' },
  { to: '/supplier/general', label: 'General', icon: Newspaper },
  { to: '/supplier/chat', label: 'Messages', icon: MessageSquare, badge: 'unreadMessages' },
  { to: '/supplier/blogs', label: 'Blogs', icon: FileText },
  { to: '/supplier/notifications', label: 'Notifications', icon: Bell, badge: 'unreadNotifications' },
  { to: '/supplier/profile', label: 'Profile', icon: User },
];

/** Admin sidebar — grouped for consistent scanning. */
export const adminNavItems = [
  // Overview
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, section: 'Overview' },

  // People
  { to: '/admin/users', label: 'Users', icon: Users, section: 'People' },
  { to: '/admin/chat', label: 'Chat', icon: MessageSquare, badge: 'unreadMessages', section: 'People' },

  // Content
  { to: '/admin/general', label: 'General Post', icon: Newspaper, section: 'Content' },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag, section: 'Content' },
  { to: '/admin/recruitment', label: 'Recruitment', icon: Briefcase, section: 'Content' },
  { to: '/admin/advertisement', label: 'Advertisement', icon: Megaphone, section: 'Content' },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText, section: 'Content' },

  // Insights
  { to: '/admin/reports', label: 'Reports', icon: ShieldCheck, section: 'Insights' },
  { to: '/admin/statistics', label: 'Statistics', icon: BarChart3, section: 'Insights' },
  { to: '/admin/payments', label: 'Payments', icon: Receipt, section: 'Insights' },

  // Account
  { to: '/admin/settings', label: 'Settings', icon: Settings, section: 'Account' },
  { to: '/admin/profile', label: 'Profile', icon: User, section: 'Account' },
];
