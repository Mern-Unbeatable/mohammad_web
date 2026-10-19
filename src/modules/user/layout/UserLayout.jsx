import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import DashboardNavbar from "@/modules/user/components/shell/DashboardNavbar";
import MobileBottomNav from "@/modules/user/components/shell/MobileBottomNav";
import { FeedActionsProvider } from "@/modules/user/context/FeedActionsContext";
import { LayoutChromeProvider } from "@/shared/context/LayoutChromeContext";
import AppFooter from "@/shared/layout/FooterLayout";
import ScrollToTop from "@/shared/routing/ScrollToTop";
import { fetchUserProfile } from "@/features/user/profile";

const UserLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userProfile.user);

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  return (
    <FeedActionsProvider>
      <LayoutChromeProvider>
        <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
          <ScrollToTop />
          <DashboardNavbar />
          <div className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            <Outlet />
          </div>
          <div className="hidden xl:block">
            <AppFooter />
          </div>
          <MobileBottomNav />
        </div>
      </LayoutChromeProvider>
    </FeedActionsProvider>
  );
};

export default UserLayout;
