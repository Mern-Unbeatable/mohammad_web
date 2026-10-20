import { Loader2, LogOut } from "lucide-react";
import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";
import CountBadge from "@/components/ui/CountBadge";
import { AVATAR_ACCENT_CLASS, NAV_ITEMS } from "../../constant/constants";
import { isNavItemActive } from "@/shared/utils/nav/navActive";
import { profileSubtitle } from "@/shared/utils/nav/membership";

/** Mobile slide-in menu; mount only while open so closed layers never cover the header. */
const MobileMenuDrawer = ({
  profileUser,
  pathname,
  badgeFor,
  badgeLabelFor,
  onClose,
  onLogout,
  loggingOut,
}) => (
  <>
    <div
      aria-hidden="false"
      onClick={onClose}
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
            className={AVATAR_ACCENT_CLASS}
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-deep-blue">
              {profileUser?.name || "Member"}
            </p>
            <p className="truncate text-[12px] text-[#64748B]">
              {profileSubtitle(profileUser)}
            </p>
          </div>
        </div>

        <ul className="space-y-1">
          {NAV_ITEMS.map((item, index) => {
            const { id, label, to } = item;
            const active = isNavItemActive(item, pathname);
            return (
              <li
                key={id}
                className="motion-safe:animate-menu-item-in"
                style={{ animationDelay: `${60 + index * 30}ms` }}
              >
                <Link
                  to={to}
                  onClick={onClose}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-secondary text-primary"
                      : "text-[#475467] hover:bg-[#F9FAFB]"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
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
          style={{ animationDelay: `${60 + NAV_ITEMS.length * 30}ms` }}
        >
          <button
            type="button"
            onClick={onLogout}
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
);

export default MobileMenuDrawer;
