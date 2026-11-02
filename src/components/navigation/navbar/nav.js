import {
  BarChart3,
  Bell,
  Briefcase,
  FileText,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User,
  Users,
} from 'lucide-react';

export const supplierNavItems = [
  { to: '/supplier', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/supplier/ads', label: 'My Ads', icon: Megaphone },
  { to: '/supplier/contacts', label: 'Contacts', icon: Users },
  { to: '/supplier/recruitment', label: 'Recruitment', icon: Briefcase, badge: 'newApplications' },
  { to: '/supplier/general', label: 'General', icon: Newspaper },
  { to: '/supplier/chat', label: 'Messages', icon: MessageSquare, badge: 'unreadMessages' },
  { to: '/supplier/blogs', label: 'Blogs', icon: FileText },
  { to: '/supplier/notifications', label: 'Notifications', icon: Bell, badge: 'unreadNotifications' },
  { to: '/supplier/profile', label: 'Profile', icon: User },
];

export const adminNavItems = [
  { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/recruitment', label: 'Recruitment', icon: Briefcase },
  { to: '/admin/chat', label: 'Chat', icon: MessageSquare, badge: 'unreadMessages' },
  { to: '/admin/general', label: 'General Post', icon: Newspaper },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/admin/reports', label: 'Reports Resolved', icon: ShieldCheck },
  { to: '/admin/advertisement', label: 'Advertisement', icon: Megaphone },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/statistics', label: 'Statistics & Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/profile', label: 'Profile', icon: User },
];
