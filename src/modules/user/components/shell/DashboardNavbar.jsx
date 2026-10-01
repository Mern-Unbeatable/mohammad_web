import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Store,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import logo from "@/assets/logo.png";
import Avatar from "@/components/ui/Avatar";
import Container from "@/components/ui/Container";
import CountBadge from "@/components/ui/CountBadge";
import { useAuth } from "@/shared/auth/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { navItems } from "@/modules/user/data/dashboard";
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
import { useNotificationBadge } from "@/shared/hooks/useNotificationBadge";
import { CHAT_BASE_PATHS } from "@/shared/constants/chat";

const userNotificationBadge = {
  fetchCount: fetchUserUnreadNotificationCount,
  selectCount: selectUserUnreadNotificationCount,
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

const resultLabel = (item, type) => {
  if (type === "users") {
    return (
      item.name ||
      [item.firstName, item.lastName].filter(Boolean).join(" ") ||
      item.email ||
      "User"
    );
  }
  if (type === "posts") return item.content || item.title || "Post";
  if (type === "blogs") return item.title || item.slug || "Blog";
  return item.title || item.name || "Result";
};

const resultHref = (item, type) => {
  if (type === "users") return `/contacts/${item.id}`;
  if (type === "jobs") return `/recruitment/${item.id}`;
  if (type === "listings") return `/marketplace/${item.id}`;
  if (type === "posts") return "/feed";
  if (type === "blogs") return `/blogs/${item.slug || item.id}`;
  return "#";
};

const SearchDropdown = ({ open, loading, groups, onSelect }) => {
  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[80] max-h-[70vh] overflow-y-auto rounded-xl border border-[#E4E7EC] bg-white py-2 shadow-lg">
      {loading && !groups.length ? (
        <p className="px-4 py-3 text-[13px] text-[#64748B]">Searching…</p>
      ) : groups.length ? (
        groups.map((group) => (
          <div key={group.type} className="py-1">
            <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
              {group.label}
            </p>
            {group.items.map((item) => {
              const href = resultHref(item, group.type);
              const label = resultLabel(item, group.type);
              return (
                <button
                  key={`${group.type}-${item.id || item.slug || label}`}
                  type="button"
                  onClick={() => onSelect(href)}
                  className="flex w-full items-start gap-2 px-4 py-2 text-left hover:bg-[#F9FAFB]"
                >
                  <span className="line-clamp-2 text-[13px] font-medium text-deep-blue">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        ))
      ) : (
        <p className="px-4 py-3 text-[13px] text-[#64748B]">No results found</p>
      )}
    </div>
  );
};

const DashboardNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { results, loading, error } = useSelector((state) => state.userSearch);
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const { conversations: unreadChats } = useUnreadMessages();
  const unreadNotifications = useNotificationBadge(userNotificationBadge);
  const badges = {
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
    closeMenu();
    await logout();
    navigate("/login", { replace: true });
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
    dispatch(fetchGlobalSearch({ q: debouncedQuery, limit: 5 }));
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

  const groups = useMemo(() => {
    const entries = [
      ["users", "People", model.users],
      ["jobs", "Jobs", model.jobs],
      ["listings", "Listings", model.listings],
      ["posts", "Posts", model.posts],
      ["blogs", "Blogs", model.blogs],
    ];
    return entries
      .map(([type, label, items]) => ({
        type,
        label,
        items: (items || []).slice(0, 5),
      }))
      .filter((group) => group.items.length > 0);
  }, [model]);

  const showDropdown = searchOpen && Boolean(debouncedQuery);

  const handleSelect = (href) => {
    setSearchOpen(false);
    setQuery("");
    dispatch(clearSearchResults());
    if (href && href !== "#") navigate(href);
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
              onFocus={() => setSearchOpen(true)}
              placeholder="Search..."
              aria-label="Search professionals, products, jobs"
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F3F4F6] py-2 pl-9 pr-3 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 sm:py-2.5 sm:pl-10 sm:text-[14px]"
            />
            <SearchDropdown
              open={showDropdown}
              loading={loading}
              groups={groups}
              onSelect={handleSelect}
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
                : unreadNotifications
                  ? `Open menu, ${badges.notifications.label}`
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
            {!menuOpen && unreadNotifications ? (
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
              onFocus={() => setSearchOpen(true)}
              placeholder="Search professionals, products, jobs..."
              aria-label="Search professionals, products, jobs"
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <SearchDropdown
              open={showDropdown}
              loading={loading}
              groups={groups}
              onSelect={handleSelect}
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
            className="fixed inset-0 z-[60] bg-[#0A1A44]/50 xl:hidden"
          />

          <div className="fixed inset-x-0 top-14 bottom-0 z-[65] overflow-y-auto bg-white xl:hidden">
            <Container className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-4 sm:pb-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#E4E7EC] pb-4">
                <Avatar
                  src={profileUser?.avatar}
                  alt={profileUser?.name || "Member"}
                  initials={profileUser?.initials || "MB"}
                  size="md"
                  className="bg-[#FEF3C7] text-[#B45309]"
                />
                <div>
                  <p className="text-[14px] font-semibold text-deep-blue">
                    {profileUser?.name || "Member"}
                  </p>
                  <p className="text-[12px] text-[#64748B]">
                    {[profileUser?.title, profileUser?.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-2">
                {navItems.map(({ id, label, icon, to }) => {
                  const Icon = iconMap[icon];
                  const active = isNavActive({ id, to });
                  return (
                    <li key={id}>
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

              <div className="mt-6 border-t border-[#E4E7EC] pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-3 text-[14px] font-semibold text-[#475467] transition-colors hover:border-[#D0D5DD] hover:bg-[#F9FAFB]"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </div>
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardNavbar;
