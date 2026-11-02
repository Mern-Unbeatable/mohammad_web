import { Bell, Menu, X } from "lucide-react";
import { Link } from "react-router";
import logo from "@/assets/logo.png";
import CountBadge from "@/components/ui/CountBadge";
import { hasMenuAlerts, menuToggleLabel } from "@/shared/utils/nav/badges";
import { NOTIFICATIONS_PATH } from "../../constant/constants";
import NavSearchField from "./NavSearchField";

/** Mobile & tablet header row: logo, search, notifications shortcut, menu toggle. */
const MobileHeader = ({
  search,
  badges,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
}) => {
  const unreadNotifications = badges.notifications?.count ?? 0;

  return (
    <div className="mx-auto flex h-(--dashboard-header-h) w-full items-center gap-1.5 px-4 sm:gap-2 sm:px-6 xl:hidden">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2"
        onClick={onCloseMenu}
      >
        <img src={logo} alt="Lab Unity" className="h-7 w-auto sm:h-8" />
        <span className="hidden text-[16px] font-bold text-deep-blue sm:inline lg:text-[17px]">
          Lab Unity
        </span>
      </Link>

      <div className="hidden flex-1 sm:block" aria-hidden="true" />

      <NavSearchField
        containerRef={search.mobileSearchRef}
        className="relative min-w-0 flex-1 sm:w-[200px] sm:flex-none md:w-[240px] lg:w-[280px]"
        iconClassName="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
        inputClassName="h-9 w-full rounded-full border border-[#E4E7EC] bg-[#F3F4F6] pl-9 pr-3 text-[16px] text-deep-blue outline-none placeholder:text-[14px] placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 sm:h-10 sm:pl-10 sm:text-[14px]"
        placeholder="Search..."
        field={search.field}
        dropdown={search.dropdown}
      />

      <Link
        to={NOTIFICATIONS_PATH}
        onClick={onCloseMenu}
        className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
        aria-label={
          unreadNotifications
            ? `Notifications, ${badges.notifications.label}`
            : "Notifications"
        }
      >
        <Bell className="h-5 w-5" />
        <CountBadge
          count={unreadNotifications}
          className="absolute right-0.5 top-0.5 sm:right-1 sm:top-1"
        />
      </Link>

      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={menuToggleLabel(menuOpen, badges)}
        aria-expanded={menuOpen}
        className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep-blue hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        {!menuOpen && hasMenuAlerts(badges) ? (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#CC1016] ring-2 ring-white sm:right-2 sm:top-2" />
        ) : null}
      </button>
    </div>
  );
};

export default MobileHeader;
