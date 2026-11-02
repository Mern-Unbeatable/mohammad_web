import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { adminDashboardReducer } from "../features/dash/admin/dashboard";
import { adminStatisticsReducer } from "../features/dash/admin/statistics";
import { adminUsersReducer } from "../features/dash/admin/users";
import { adminRecruitmentReducer } from "../features/dash/admin/recruitment";
import { adminGeneralReducer } from "../features/dash/admin/general";
import { adminMarketplaceReducer } from "../features/dash/admin/marketplace";
import { adminReportsReducer } from "../features/dash/admin/reports";
import { adminAdsReducer } from "../features/dash/admin/advertisements";
import { adminBlogsReducer } from "../features/dash/admin/blogs";
import { adminSettingsReducer } from "../features/dash/admin/settings";
import { adminProfileReducer } from "../features/dash/admin/profile";
import { adminMessagesReducer } from "@/features/messages/moderation";
import { messagesReducer } from "../features/messages";
import { supplierDashboardReducer } from "../features/dash/supplier/dashboard";
import { supplierAdsReducer } from "../features/dash/supplier/advertisements";
import { supplierContactsReducer } from "../features/dash/supplier/contacts";
import { supplierRecruitmentReducer } from "../features/dash/supplier/recruitment";
import { supplierGeneralReducer } from "../features/dash/supplier/general";
import { supplierBlogsReducer } from "../features/dash/supplier/blogs";
import { supplierNotificationsReducer } from "../features/dash/supplier/notifications";
import { supplierProfileReducer } from "../features/dash/supplier/profile";
import { userProfileReducer } from "../features/dash/user/profile";
import { userContactsReducer } from "../features/dash/user/contacts";
import { userMarketplaceReducer } from "../features/dash/user/marketplace";
import { userRecruitmentReducer } from "../features/dash/user/recruitment";
import { userReportsReducer } from "../features/dash/user/reports";
import { userSearchReducer } from "../features/dash/user/search";
import { userFeedReducer } from "../features/dash/user/feed";
import { userRightSidebarReducer } from "../features/dash/user/rightSidebar";
import { userAdvertisementsRailReducer } from "../features/dash/user/advertisementsRail";
import { userNotificationsReducer } from "../features/dash/user/notifications";
import { userSubscriptionsReducer } from "../features/dash/user/subscriptions";
import { userGeneralReducer } from "../features/dash/user/general";
import { userBlogsReducer } from "../features/dash/user/blogs";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminDashboard: adminDashboardReducer,
    adminStatistics: adminStatisticsReducer,
    adminUsers: adminUsersReducer,
    adminRecruitment: adminRecruitmentReducer,
    adminGeneral: adminGeneralReducer,
    adminMarketplace: adminMarketplaceReducer,
    adminReports: adminReportsReducer,
    adminAds: adminAdsReducer,
    adminBlogs: adminBlogsReducer,
    adminSettings: adminSettingsReducer,
    adminProfile: adminProfileReducer,
    adminMessages: adminMessagesReducer,
    messages: messagesReducer,
    supplierDashboard: supplierDashboardReducer,
    supplierAds: supplierAdsReducer,
    supplierContacts: supplierContactsReducer,
    supplierRecruitment: supplierRecruitmentReducer,
    supplierGeneral: supplierGeneralReducer,
    supplierBlogs: supplierBlogsReducer,
    supplierNotifications: supplierNotificationsReducer,
    supplierProfile: supplierProfileReducer,
    userProfile: userProfileReducer,
    userContacts: userContactsReducer,
    userMarketplace: userMarketplaceReducer,
    userRecruitment: userRecruitmentReducer,
    userReports: userReportsReducer,
    userSearch: userSearchReducer,
    userFeed: userFeedReducer,
    userRightSidebar: userRightSidebarReducer,
    userAdvertisementsRail: userAdvertisementsRailReducer,
    userNotifications: userNotificationsReducer,
    userSubscriptions: userSubscriptionsReducer,
    userGeneral: userGeneralReducer,
    userBlogs: userBlogsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
