import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { adminDashboardReducer } from "../features/admin/dashboard";
import { adminStatisticsReducer } from "../features/admin/statistics";
import { adminUsersReducer } from "../features/admin/users";
import { adminRecruitmentReducer } from "../features/admin/recruitment";
import { adminGeneralReducer } from "../features/admin/general";
import { adminMarketplaceReducer } from "../features/admin/marketplace";
import { adminReportsReducer } from "../features/admin/reports";
import { adminAdsReducer } from "../features/admin/advertisements";
import { adminBlogsReducer } from "../features/admin/blogs";
import { adminSettingsReducer } from "../features/admin/settings";
import { adminProfileReducer } from "../features/admin/profile";
import { adminMessagesReducer } from "../features/admin/messages";
import { messagesReducer } from "../features/messages";
import { supplierDashboardReducer } from "../features/supplier/dashboard";
import { supplierAdsReducer } from "../features/supplier/advertisements";
import { supplierContactsReducer } from "../features/supplier/contacts";
import { supplierRecruitmentReducer } from "../features/supplier/recruitment";
import { supplierGeneralReducer } from "../features/supplier/general";
import { supplierBlogsReducer } from "../features/supplier/blogs";
import { supplierNotificationsReducer } from "../features/supplier/notifications";
import { supplierProfileReducer } from "../features/supplier/profile";
import { userProfileReducer } from "../features/user/profile";
import { userContactsReducer } from "../features/user/contacts";
import { userMarketplaceReducer } from "../features/user/marketplace";
import { userRecruitmentReducer } from "../features/user/recruitment";
import { userReportsReducer } from "../features/user/reports";
import { userSearchReducer } from "../features/user/search";
import { userFeedReducer } from "../features/user/feed";
import { userNotificationsReducer } from "../features/user/notifications";
import { userSubscriptionsReducer } from "../features/user/subscriptions";
import { userGeneralReducer } from "../features/user/general";
import { userBlogsReducer } from "../features/user/blogs";

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
