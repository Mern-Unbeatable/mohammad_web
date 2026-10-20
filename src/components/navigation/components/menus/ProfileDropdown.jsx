import { useSelector } from "react-redux";
import { Clock, Crown, Loader2, LogOut, Sparkles, User } from "lucide-react";
import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";
import { toProfilePageUser } from "@/features/dash/user/profile";
import { AVATAR_ACCENT_CLASS, PROFILE_PATH } from "../../constant/constants";
import { useDropdown } from "../../hooks/useDropdown";
import { useLogout } from "../../hooks/useLogout";
import {
  dropdownMembershipBanner,
  expiredOrUpgradeText,
  profileSubtitle,
} from "../../utils/membership";
import ViewPlansLink from "../membership/ViewPlansLink";

const ProfileDropdown = () => {
  const { handleLogout, loggingOut } = useLogout();
  const { open, rootRef, toggle, close } = useDropdown({ locked: loggingOut });
  const { user } = useSelector((state) => state.userProfile);
  const profile = toProfilePageUser(user);

  const displayName = profile?.name || "Member";
  const subtitle = profileSubtitle(profile);
  const banner = dropdownMembershipBanner(profile);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Avatar
          src={profile?.avatar}
          alt={displayName}
          initials={profile?.initials || "MB"}
          size="sm"
          className={AVATAR_ACCENT_CLASS}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[80] origin-top-right motion-safe:animate-dropdown-in w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-xl"
        >
          <div className="border-b border-[#E4E7EC] px-4 py-4">
            <p className="text-[15px] font-bold text-deep-blue">
              {displayName}
            </p>
            {subtitle ? (
              <p className="mt-1 text-[12px] leading-snug text-[#64748B]">
                {subtitle}
              </p>
            ) : null}
          </div>

          {banner === "trial" ? (
            <div className="border-b border-[#E4E7EC] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
                  <Sparkles aria-hidden className="h-4 w-4 text-[#B8860B]" />
                  Free trial
                </p>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#64748B]">
                  <Clock aria-hidden className="h-3.5 w-3.5" />
                  {profile.trialDaysLeft} days left
                </span>
              </div>
              <ViewPlansLink onClick={close} />
            </div>
          ) : banner === "upgrade" ? (
            <div className="border-b border-[#E4E7EC] px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
                <Crown aria-hidden className="h-4 w-4 text-[#E67E22]" />
                Membership
              </p>
              <p className="mt-1 text-[12px] text-red-500">
                {expiredOrUpgradeText(profile?.membershipStatus)}
              </p>
              <ViewPlansLink onClick={close} />
            </div>
          ) : null}

          <ul className="py-1">
            <li>
              <Link
                to={PROFILE_PATH}
                role="menuitem"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
              >
                <User
                  className="h-[18px] w-[18px] text-[#64748B]"
                  strokeWidth={1.8}
                />
                Profile
              </Link>
            </li>
          </ul>

          <div className="border-t border-[#E4E7EC]">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-busy={loggingOut}
              className="flex w-full items-center gap-3 bg-[#FEF2F2] px-4 py-3 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEE2E2] disabled:cursor-wait disabled:opacity-70"
            >
              {loggingOut ? (
                <Loader2
                  className="h-[18px] w-[18px] animate-spin"
                  strokeWidth={1.8}
                />
              ) : (
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
              )}
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
