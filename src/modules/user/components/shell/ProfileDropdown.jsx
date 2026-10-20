import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Clock,
  CreditCard,
  Crown,
  Loader2,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/shared/auth/useAuth";
import { toProfilePageUser } from "@/features/user/profile";

const ViewPlansLink = ({ onClick }) => (
  <Link
    to="/subscription"
    onClick={onClick}
    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
  >
    <Crown aria-hidden className="h-4 w-4" />
    View plans
  </Link>
);

const ProfileDropdown = () => {
  const { logout, loggingOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const { user } = useSelector((state) => state.userProfile);
  const profile = toProfilePageUser(user);

  useEffect(() => {
    if (!open || loggingOut) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loggingOut]);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    if (await logout()) navigate("/login", { replace: true });
  };

  const displayName = profile?.name || "Member";
  const subtitle = [profile?.title, profile?.company]
    .filter(Boolean)
    .join(" · ");
  const isTrial = profile?.membershipStatus === "trial";
  const showUpgrade =
    !profile?.isActive ||
    profile?.membershipStatus === "expired" ||
    profile?.membershipStatus === "free";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
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
          className="bg-[#FEF3C7] text-[#B45309]"
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

          {isTrial ? (
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
          ) : showUpgrade ? (
            <div className="border-b border-[#E4E7EC] px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
                <Crown aria-hidden className="h-4 w-4 text-[#E67E22]" />
                Membership
              </p>
              <p className="mt-1 text-[12px] text-red-500">
                {profile?.membershipStatus === "expired"
                  ? "Your membership has expired."
                  : "Upgrade for full Lab Unity access."}
              </p>
              <ViewPlansLink onClick={close} />
            </div>
          ) : null}

          <ul className="py-1">
            <li>
              <Link
                to="/profile"
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
