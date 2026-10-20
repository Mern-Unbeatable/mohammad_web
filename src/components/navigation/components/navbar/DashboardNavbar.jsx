import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { toProfilePageUser } from "@/features/dash/user/profile";
import { useNavBadges } from "../../hooks/useNavBadges";
import { useNavSearch } from "../../hooks/useNavSearch";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import { useLogout } from "../../hooks/useLogout";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileMenuDrawer from "./MobileMenuDrawer";

const DashboardNavbar = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loggingOut } = useLogout();
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const { badges, unreadChats, badgeFor, badgeLabelFor } = useNavBadges();
  useBodyScrollLock(menuOpen);
  const search = useNavSearch();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-[#E4E7EC] bg-white">
        <MobileHeader
          search={search}
          badges={badges}
          unreadChats={unreadChats}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((prev) => !prev)}
          onCloseMenu={closeMenu}
        />
        <DesktopHeader
          search={search}
          pathname={pathname}
          badgeFor={badgeFor}
          badgeLabelFor={badgeLabelFor}
        />
      </header>

      {menuOpen && (
        <MobileMenuDrawer
          profileUser={profileUser}
          pathname={pathname}
          badgeFor={badgeFor}
          badgeLabelFor={badgeLabelFor}
          onClose={closeMenu}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      )}
    </>
  );
};

export default DashboardNavbar;
