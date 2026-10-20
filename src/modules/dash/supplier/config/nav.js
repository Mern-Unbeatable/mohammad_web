import {
  Bell,
  Briefcase,
  FileText,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Newspaper,
  User,
  Users,
} from 'lucide-react';

export const supplierNavItems = [
  { to: '/supplier', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/supplier/ads', label: 'My Ads', icon: Megaphone },
  { to: '/supplier/contacts', label: 'Contacts', icon: Users },
  { to: '/supplier/recruitment', label: 'Recruitment', icon: Briefcase },
  { to: '/supplier/general', label: 'General', icon: Newspaper },
  { to: '/supplier/chat', label: 'Messages', icon: MessageSquare, badge: 'unreadMessages' },
  { to: '/supplier/blogs', label: 'Blogs', icon: FileText },
  { to: '/supplier/notifications', label: 'Notifications', icon: Bell, badge: 'unreadNotifications' },
  { to: '/supplier/profile', label: 'Profile', icon: User },
];
