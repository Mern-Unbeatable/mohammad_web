import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DashboardNavbar, MobileBottomNav } from "@/components/navigation";
import { FeedActionsProvider } from "@/modules/dash/user/pages/feed/context/FeedActionsContext";
import { LayoutChromeProvider } from "@/shared/context/LayoutChromeContext";
import AppFooter from "@/components/navigation/footer/AppFooter";
import ScrollToTop from "@/components/common/scrolls/ScrollToTop";
import { fetchUserProfile } from "@/features/dash/user/profile";

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
