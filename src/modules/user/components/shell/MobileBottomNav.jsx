import { Bell, Briefcase, Home, SquarePlus, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import CountBadge from '@/components/ui/CountBadge';
import { selectUserUnreadNotificationCount } from '@/features/user/notifications';
import { useFeedActions } from '@/modules/user/context/FeedActionsContext';
import { useLayoutChrome } from '@/shared/context/LayoutChromeContext';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, to: '/feed' },
  { id: 'network', label: 'Network', icon: Users, to: '/contacts', badge: 2 },
  { id: 'post', label: 'Post', icon: SquarePlus, action: 'create' },
  { id: 'notifications', label: 'Notifications', icon: Bell, to: '/notifications' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, to: '/recruitment' },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { openCreatePost } = useFeedActions();
  const { bottomNavHidden } = useLayoutChrome();
  // Kept fresh by `useNotificationBadge` in DashboardNavbar.
  const unreadNotifications = useSelector(selectUserUnreadNotificationCount);

  if (bottomNavHidden) return null;

  const badgeFor = (tab) => (tab.id === 'notifications' ? unreadNotifications : tab.badge);

  const isTabActive = (tab) => {
    if (tab.id === 'home') return pathname === '/feed';
    if (tab.id === 'network') return pathname.startsWith('/contacts');
    if (tab.id === 'jobs') return pathname.startsWith('/recruitment');
    if (tab.id === 'notifications') return pathname.startsWith('/notifications');
    return pathname === tab.to;
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4E7EC] bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto flex h-14 max-w-lg items-stretch">
        {tabs.map((tab) => {
          const { id, label, to, action } = tab;
          const Icon = tab.icon;
          const isActive = isTabActive(tab);
          const badge = badgeFor(tab);
          const isPost = action === 'create';

          const content = (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-deep-blue" />
              )}
              <span className="relative">
                <Icon
                  className={`h-6 w-6 ${isActive ? 'text-deep-blue' : 'text-[#64748B]'}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <CountBadge count={badge} className="absolute -right-2 -top-1" />
              </span>
              <span
                className={`text-[10px] font-medium leading-none ${
                  isActive ? 'text-deep-blue' : 'text-[#64748B]'
                }`}
              >
                {label}
              </span>
            </>
          );

          return (
            <li key={id} className="flex flex-1">
              {isPost ? (
                <button
                  type="button"
                  onClick={openCreatePost}
                  className="relative flex flex-1 flex-col items-center justify-center gap-0.5"
                >
                  {content}
                </button>
              ) : (
                <Link
                  to={to}
                  className="relative flex flex-1 flex-col items-center justify-center gap-0.5"
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
