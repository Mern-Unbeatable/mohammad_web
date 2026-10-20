import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DashboardNavbar, MobileBottomNav } from "@/components/navigation";
import { CreatePostActionProvider } from "@/shared/context/CreatePostActionProvider";
import { LayoutChromeProvider } from "@/shared/context/LayoutChromeContext";
import AppFooter from "@/components/navigation/footer/AppFooter";
import { fetchUserProfile } from "@/features/dash/user/profile";

const FEED_PATH = "/feed";

/**
 * User dashboard shell; owns the `<main>` landmark (pages render `DashboardPage`).
 * `children` replaces the outlet when rendered by the catch-all route.
 */
const UserLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userProfile.user);

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  return (
    <CreatePostActionProvider composerPath={FEED_PATH}>
      <LayoutChromeProvider>
        <div className="dashboard-shell flex min-h-screen flex-col bg-[#F3F4F6]">
          <DashboardNavbar />
          <main className="flex-1 pb-safe-nav sm:pb-0">
            {children ?? <Outlet />}
          </main>
          <div className="hidden xl:block">
            <AppFooter />
          </div>
          <MobileBottomNav />
        </div>
      </LayoutChromeProvider>
    </CreatePostActionProvider>
  );
};

export default UserLayout;
