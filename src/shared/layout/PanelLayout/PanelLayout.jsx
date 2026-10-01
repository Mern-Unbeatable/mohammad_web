import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router';
import { LogOut, Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import Avatar from '@/components/ui/Avatar';
import CountBadge from '@/components/ui/CountBadge';
import { useUnreadMessages } from '@/features/messages';
import { useAuth } from '@/shared/auth/useAuth';
import { toAccountIdentity } from '@/shared/auth/accountIdentity';
import { roleLabel as formatRoleLabel } from '@/shared/constants/roles';
import ScrollToTop from '@/shared/routing/ScrollToTop';

const SIDEBAR_WIDTH = 260;

/** `badgeCounts` adds role-specific nav badges keyed by `navItems[].badge`. */
const PanelLayout = ({ navItems, badgeCounts: extraBadgeCounts, children }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleLabel = formatRoleLabel(role || user?.role);
  const identity = toAccountIdentity(user);
  const { conversations: unreadChats } = useUnreadMessages();
  const badgeCounts = { unreadMessages: unreadChats, ...extraBadgeCounts };
  const hasBadges = navItems.some(({ badge }) => badgeCounts[badge] > 0);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E4E7EC] px-5">
        <Link to="/" onClick={closeSidebar} className="flex items-center gap-2.5">
          <img src={logo} alt="Lab Unity" className="h-8 w-auto" />
          <span className="text-[17px] font-bold text-deep-blue">Lab Unity</span>
        </Link>
        <button
          type="button"
          onClick={closeSidebar}
          className="rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB] lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
          Main menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-l-[3px] border-primary bg-secondary pl-[calc(0.75rem-3px)] text-primary'
                      : 'border-l-[3px] border-transparent text-[#475467] hover:bg-[#F9FAFB] hover:text-deep-blue'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                {label}
                <CountBadge
                  count={badgeCounts[badge]}
                  label={`${badgeCounts[badge]} unread`}
                  className="ml-auto"
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-[#E4E7EC] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] p-3">
          <Avatar
            src={identity.avatar}
            alt={identity.name}
            initials={identity.initials}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-deep-blue">{identity.name}</p>
            <p className="text-[11px] text-[#64748B]">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-pink-light transition-colors hover:bg-pink-secondary"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <ScrollToTop />
      {/* Mobile overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#E4E7EC] bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar spacer — keeps layout without duplicate aside */}
      <div className="hidden shrink-0 lg:block" style={{ width: SIDEBAR_WIDTH }} aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E4E7EC] bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="relative rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label={hasBadges ? 'Open menu, unread items' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
            {hasBadges ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#CC1016] ring-2 ring-white" />
            ) : null}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Lab Unity" className="h-7 w-auto" />
            <span className="text-[15px] font-bold text-deep-blue">Lab Unity</span>
          </Link>
        </header>

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 sm:p-5 lg:min-h-screen lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
