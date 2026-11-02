import { Link } from "react-router";
import {
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Newspaper,
  UserPlus,
} from "lucide-react";
import { usePublicAuthActions } from "../../hooks/usePublicAuthActions";
import {
  FEED_PATH,
  LOGIN_PATH,
  PUBLIC_PRIMARY_LINK_CLASS,
} from "../../constant/constants";

const MOBILE_PRIMARY_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-white transition-opacity hover:opacity-90";
const MOBILE_SECONDARY_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] text-[15px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-70";

/** Mobile menu: full-width buttons, main action first. */
const MobileAuthActions = ({
  isAuthenticated,
  isSupplierOrAdmin,
  homePath,
  loggingOut,
  handleLogout,
  onNavigate,
  className,
}) => {
  if (isAuthenticated) {
    const HomeIcon = isSupplierOrAdmin ? LayoutDashboard : Newspaper;
    return (
      <div className={className}>
        <Link
          to={isSupplierOrAdmin ? homePath : FEED_PATH}
          onClick={onNavigate}
          className={MOBILE_PRIMARY_CLASS}
        >
          <HomeIcon className="h-5 w-5" />
          {isSupplierOrAdmin ? "Go to dashboard" : "Go to feed"}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className={`${MOBILE_SECONDARY_CLASS} text-[#DC2626] hover:border-[#FECACA] hover:bg-[#FEF2F2]`}
        >
          {loggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link to="/join" onClick={onNavigate} className={MOBILE_PRIMARY_CLASS}>
        <UserPlus className="h-5 w-5" />
        Join Lab Unity
      </Link>
      <Link
        to={LOGIN_PATH}
        onClick={onNavigate}
        className={`${MOBILE_SECONDARY_CLASS} text-deep-blue hover:bg-[#F9FAFB]`}
      >
        <LogIn className="h-5 w-5" />
        Log in
      </Link>
    </div>
  );
};

/** Log in / Join for guests; Logout + Dashboard (supplier, admin) or Feed (user) when signed in. */
const PublicAuthActions = ({
  onNavigate,
  className = "",
  variant = "desktop",
}) => {
  const auth = usePublicAuthActions({ onNavigate });
  const {
    isAuthenticated,
    isSupplierOrAdmin,
    homePath,
    loggingOut,
    handleLogout,
  } = auth;

  if (variant === "mobile") {
    return (
      <MobileAuthActions
        {...auth}
        onNavigate={onNavigate}
        className={className}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className="inline-flex items-center gap-2 rounded-full border border-[#E4E7EC] px-5 py-2.5 text-[14px] font-medium leading-none text-[#475467] transition-colors hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#DC2626] disabled:cursor-wait disabled:opacity-70 xl:px-6 xl:py-3 xl:text-[15px]"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
        <Link
          to={isSupplierOrAdmin ? homePath : FEED_PATH}
          onClick={onNavigate}
          className={`inline-flex items-center gap-2 ${PUBLIC_PRIMARY_LINK_CLASS}`}
        >
          {isSupplierOrAdmin ? (
            <LayoutDashboard className="h-4 w-4" />
          ) : (
            <Newspaper className="h-4 w-4" />
          )}
          {isSupplierOrAdmin ? "Dashboard" : "Feed"}
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link
        to={LOGIN_PATH}
        onClick={onNavigate}
        className="px-3 text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary xl:text-[16px]"
      >
        Log in
      </Link>
      <Link
        to="/join"
        onClick={onNavigate}
        className={PUBLIC_PRIMARY_LINK_CLASS}
      >
        Join Lab Unity
      </Link>
    </div>
  );
};

export default PublicAuthActions;
