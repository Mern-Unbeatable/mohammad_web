import { Link, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import CountBadge from '@/components/ui/CountBadge';
import { selectPendingRequestCount } from '@/features/dash/user/contacts';
import { useCreatePostAction } from '@/shared/context/useCreatePostAction';
import { useLayoutChrome } from '@/shared/context/useLayoutChrome';
import { BOTTOM_NAV_TABS } from '../../constant/constants';
import { isBottomTabActive } from '@/shared/utils/nav/navActive';

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { openCreatePost } = useCreatePostAction();
  const { bottomNavHidden } = useLayoutChrome();
  // Kept fresh by `useNavBadges` in DashboardNavbar.
  const unreadChats = useSelector((state) => state.messages.unread?.conversations ?? 0);
  const pendingRequests = useSelector(selectPendingRequestCount);

  if (bottomNavHidden) return null;

  const badges = { messages: unreadChats, network: pendingRequests };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4E7EC] bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto flex h-(--bottom-nav-h) max-w-lg items-stretch">
        {BOTTOM_NAV_TABS.map((tab) => {
          const { id, label, to, action } = tab;
          const Icon = tab.icon;
          const isActive = isBottomTabActive(tab, pathname);
          const badge = badges[id] ?? 0;
          const isPost = action === 'create';

          const content = (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-primary" />
              )}
              <span className="relative">
                <Icon
                  className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-[#64748B]'}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <CountBadge count={badge} className="absolute -right-2 -top-1" />
              </span>
              <span
                className={`text-[10px] leading-none ${
                  isActive ? 'font-semibold text-primary' : 'font-medium text-[#64748B]'
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
                  className="group relative flex flex-1 flex-col items-center justify-end gap-1 pb-1.5 focus-visible:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 left-1/2 h-11 w-11 -translate-x-1/2 rounded-full bg-primary/35 blur-md"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#3BA3E6] to-primary text-white shadow-md shadow-primary/30 ring-[3px] ring-white/90 backdrop-blur-md transition-transform group-active:scale-95 group-focus-visible:ring-primary/40"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <span className="text-[10px] font-semibold leading-none text-primary">
                    {label}
                  </span>
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
