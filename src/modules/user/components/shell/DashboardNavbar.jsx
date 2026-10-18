import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Home,
  LayoutGrid,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Store,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import logo from "@/assets/logo.png";
import Avatar from "@/components/ui/Avatar";
import Container from "@/components/ui/Container";
import CountBadge from "@/components/ui/CountBadge";
import { useAuth } from "@/shared/auth/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { navItems } from "@/modules/user/data/dashboard";
import SearchTabs from "@/modules/user/components/search/SearchTabs";
import SearchResultsList from "@/modules/user/components/search/SearchResultsList";
import {
  DEFAULT_SEARCH_TAB,
  SEARCH_PATH,
  buildSearchPath,
  toSearchGroups,
} from "@/modules/user/components/search/searchResults";
import {
  fetchGlobalSearch,
  clearSearchResults,
  clearSearchError,
  toSearchResultsModel,
} from "@/features/user/search";
import { toProfilePageUser } from "@/features/user/profile";
import { useUnreadMessages } from "@/features/messages";
import {
  fetchUserUnreadNotificationCount,
  selectUserUnreadNotificationCount,
} from "@/features/user/notifications";
import {
  fetchPendingRequestCount,
  selectPendingRequestCount,
} from "@/features/user/contacts";
import { useNotificationBadge } from "@/shared/hooks/useNotificationBadge";
import { CHAT_BASE_PATHS } from "@/shared/constants/chat";

const userNotificationBadge = {
  fetchCount: fetchUserUnreadNotificationCount,
  selectCount: selectUserUnreadNotificationCount,
};

// Connection requests create a notification, so the same realtime events apply.
const pendingRequestsBadge = {
  fetchCount: fetchPendingRequestCount,
  selectCount: selectPendingRequestCount,
};

const iconMap = {
  home: Home,
  contacts: Users,
  marketplace: Store,
  recruitment: Briefcase,
  general: LayoutGrid,
  messages: MessageSquare,
  blogs: BookOpen,
  notifications: Bell,
};

const SEARCH_FETCH_LIMIT = 10;
const ALL_TAB_GROUP_LIMIT = 5;

const SearchDropdown = ({
  open,
  loading,
  groups,
  activeTab,
  onTabChange,
  onSelect,
  onSeeAll,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-x-2 top-[60px] z-[80] flex flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+6px)] sm:w-[max(100%,32rem)] sm:max-w-[calc(100vw-1rem)] xl:left-0 xl:right-auto">
      <SearchTabs
        activeTab={activeTab}
        onChange={onTabChange}
        className="px-1 sm:px-2"
      />

      <div
        role="tabpanel"
        className="max-h-[min(400px,calc(100dvh_-_14rem))] overflow-y-auto overscroll-contain py-2"
      >
        <SearchResultsList
          groups={groups}
          activeTab={activeTab}
          loading={loading}
          allTabLimit={ALL_TAB_GROUP_LIMIT}
          onSelect={onSelect}
          onShowAll={onTabChange}
        />
      </div>

      <button
        type="button"
        onClick={onSeeAll}
        className="flex shrink-0 items-center justify-center gap-2 border-t border-gray-200 px-4 py-2.5 text-[13px] font-semibold text-blue-600 hover:bg-[#F9FAFB]"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        See all results
      </button>
    </div>
  );
};

const DashboardNavbar = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const urlQuery =
    pathname === SEARCH_PATH ? (searchParams.get("q") ?? "") : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState(urlQuery ?? "");
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_SEARCH_TAB);
  const mobileSearchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  // Mirror the /search page's ?q= into the input; clear it when leaving that page.
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setQuery(urlQuery ?? "");
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, loggingOut } = useAuth();
  const { results, loading, error } = useSelector((state) => state.userSearch);
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const { conversations: unreadChats } = useUnreadMessages();
  const unreadNotifications = useNotificationBadge(userNotificationBadge);
  const pendingRequests = useNotificationBadge(pendingRequestsBadge);
  const badges = {
    contacts: {
      count: pendingRequests,
      label: `${pendingRequests} pending connection ${pendingRequests === 1 ? "request" : "requests"}`,
    },
    messages: {
      count: unreadChats,
      label: `${unreadChats} unread ${unreadChats === 1 ? "conversation" : "conversations"}`,
    },
    notifications: {
      count: unreadNotifications,
      label: `${unreadNotifications} unread ${unreadNotifications === 1 ? "notification" : "notifications"}`,
    },
  };
  const unreadLabel = badges.messages.label;
  const badgeFor = (id) => badges[id]?.count ?? 0;
  const badgeLabelFor = (id) => badges[id]?.label;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    if (await logout()) navigate("/login", { replace: true });
  };

  const isNavActive = (item) => {
    if (item.id === "home") return pathname === "/feed";
    if (item.id === "contacts") return pathname.startsWith("/contacts");
    if (item.id === "marketplace") return pathname.startsWith("/marketplace");
    if (item.id === "recruitment") return pathname.startsWith("/recruitment");
    if (item.id === "general") return pathname.startsWith("/general");
    if (item.id === "messages") return pathname.startsWith(CHAT_BASE_PATHS.USER);
    if (item.id === "blogs") return pathname.startsWith("/blogs");
    if (item.id === "notifications")
      return pathname.startsWith("/notifications");
    return pathname === item.to;
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      dispatch(clearSearchResults());
      return;
    }
    dispatch(clearSearchError());
    dispatch(
      fetchGlobalSearch({ q: debouncedQuery, limit: SEARCH_FETCH_LIMIT }),
    );
  }, [dispatch, debouncedQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const inMobile = mobileSearchRef.current?.contains(event.target);
      const inDesktop = desktopSearchRef.current?.contains(event.target);
      if (!inMobile && !inDesktop) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const model = useMemo(() => toSearchResultsModel(results), [results]);

  const groups = useMemo(() => toSearchGroups(model), [model]);

  const showDropdown = searchOpen && Boolean(debouncedQuery);

  const handleSelect = (href) => {
    setSearchOpen(false);
    setQuery("");
    setActiveTab(DEFAULT_SEARCH_TAB);
    dispatch(clearSearchResults());
    if (href && href !== "#") navigate(href);
  };

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(buildSearchPath(q, activeTab));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (!query.trim()) return;
    submitSearch();
    e.currentTarget.blur();
  };

  const onQueryChange = (value) => {
    setQuery(value);
    setSearchOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-[#E4E7EC] bg-white">
        {/* Mobile & tablet */}
        <div className="mx-auto flex h-14 w-full items-center gap-1.5 px-4 sm:gap-2 sm:px-6 xl:hidden">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            onClick={closeMenu}
          >
            <img src={logo} alt="Lab Unity" className="h-7 w-auto sm:h-8" />
            <span className="hidden text-[16px] font-bold text-deep-blue sm:inline lg:text-[17px]">
              Lab Unity
            </span>
          </Link>

          <div className="hidden flex-1 sm:block" aria-hidden="true" />

          <div
            ref={mobileSearchRef}
            className="relative min-w-0 flex-1 sm:w-[200px] sm:flex-none md:w-[240px] lg:w-[280px]"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search..."
              aria-label="Search professionals, products, jobs"
              className="h-9 w-full rounded-full border border-[#E4E7EC] bg-[#F3F4F6] pl-9 pr-3 text-[16px] text-deep-blue outline-none placeholder:text-[14px] placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 sm:h-10 sm:pl-10 sm:text-[14px]"
            />
            <SearchDropdown
              open={showDropdown}
              loading={loading}
              groups={groups}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelect={handleSelect}
              onSeeAll={submitSearch}
            />
          </div>

          <Link
            to={CHAT_BASE_PATHS.USER}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
            aria-label={unreadChats ? `Messages, ${unreadLabel}` : "Messages"}
          >
            <MessageSquare className="h-5 w-5" />
            <CountBadge
              count={unreadChats}
              className="absolute right-0.5 top-0.5 sm:right-1 sm:top-1"
            />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={
              menuOpen
                ? "Close menu"
                : unreadNotifications || pendingRequests
                  ? `Open menu, ${[
                      unreadNotifications && badges.notifications.label,
                      pendingRequests && badges.contacts.label,
                    ]
                      .filter(Boolean)
                      .join(", ")}`
                  : "Open menu"
            }
            aria-expanded={menuOpen}
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep-blue hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            {!menuOpen && (unreadNotifications || pendingRequests) ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#CC1016] ring-2 ring-white sm:right-2 sm:top-2" />
            ) : null}
          </button>
        </div>

        {/* Desktop */}
        <Container className="hidden h-[62px] items-center gap-4 xl:flex xl:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="Lab Unity" className="h-8 w-auto" />
            <span className="text-[17px] font-bold text-deep-blue">
              Lab Unity
            </span>
          </Link>

          <div
            ref={desktopSearchRef}
            className="relative mx-auto max-w-[420px] flex-1"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search professionals, products, jobs..."
              aria-label="Search professionals, products, jobs"
              className="h-9 w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <SearchDropdown
              open={showDropdown}
              loading={loading}
              groups={groups}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelect={handleSelect}
              onSeeAll={submitSearch}
            />
          </div>

          <nav className="flex items-center gap-0.5">
            {navItems.map(({ id, label, icon, to }) => {
              const Icon = iconMap[icon];
              const active = isNavActive({ id, to });
              return (
                <Link
                  key={id}
                  to={to}
                  className={`flex min-w-[68px] flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    active
                      ? "text-primary"
                      : "text-[#64748B] hover:bg-[#F9FAFB] hover:text-deep-blue"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                    <CountBadge
                      count={badgeFor(id)}
                      label={badgeLabelFor(id)}
                      className="absolute -right-2.5 -top-1.5"
                    />
                  </span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div
            className="mx-1 h-8 w-px shrink-0 bg-[#E4E7EC]"
            aria-hidden="true"
          />

          <ProfileDropdown />
        </Container>
      </header>

      {/* Mobile menu — only mount when open so closed layers never cover the header */}
      {menuOpen && (
        <>
          <div
            aria-hidden="false"
            onClick={closeMenu}
            className="fixed inset-0 z-[60] bg-[#0A1A44]/50 motion-safe:animate-fade-in xl:hidden"
          />

          <div className="fixed bottom-0 right-0 top-14 z-[65] w-[min(20rem,85vw)] overflow-y-auto border-l border-[#E4E7EC] bg-white shadow-xl motion-safe:animate-drawer-in-right xl:hidden">
            <div className="px-4 pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-4 sm:pb-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#E4E7EC] pb-4 motion-safe:animate-menu-item-in">
                <Avatar
                  src={profileUser?.avatar}
                  alt={profileUser?.name || "Member"}
                  initials={profileUser?.initials || "MB"}
                  size="md"
                  className="bg-[#FEF3C7] text-[#B45309]"
                />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-deep-blue">
                    {profileUser?.name || "Member"}
                  </p>
                  <p className="truncate text-[12px] text-[#64748B]">
                    {[profileUser?.title, profileUser?.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>

              <ul className="space-y-1">
                {navItems.map(({ id, label, icon, to }, index) => {
                  const Icon = iconMap[icon];
                  const active = isNavActive({ id, to });
                  return (
                    <li
                      key={id}
                      className="motion-safe:animate-menu-item-in"
                      style={{ animationDelay: `${60 + index * 30}ms` }}
                    >
                      <Link
                        to={to}
                        onClick={closeMenu}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium transition-colors ${
                          active
                            ? "bg-secondary text-primary"
                            : "text-[#475467] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {label}
                        <CountBadge
                          count={badgeFor(id)}
                          label={badgeLabelFor(id)}
                          className="ml-auto"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div
                className="mt-6 border-t border-[#E4E7EC] pt-4 motion-safe:animate-menu-item-in"
                style={{ animationDelay: `${60 + navItems.length * 30}ms` }}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-busy={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-3 text-[14px] font-semibold text-[#475467] transition-colors hover:border-[#D0D5DD] hover:bg-[#F9FAFB] disabled:cursor-wait disabled:opacity-70"
                >
                  {loggingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}
                  {loggingOut ? "Logging out…" : "Log out"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardNavbar;
