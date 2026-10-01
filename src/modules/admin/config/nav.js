import {
  BarChart3,
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
