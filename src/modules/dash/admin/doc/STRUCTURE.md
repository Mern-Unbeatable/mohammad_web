# Admin dashboard module — structure

Pages behind `/admin/*`. The folders match `modules/dash/user` and
`modules/dash/supplier`: one folder per feature, page views in `pages/`,
feature-only components in `components/`. Data loading lives in
`@/features/dash/admin/*` (Redux slices and thunks).

## Folder layout

```
admin/
├── dashboard/                               Full feature layout; see dashboard/doc/STRUCTURE.md
│   ├── pages/        AdminDashboardView (/admin)
│   ├── components/   overview/ (DashboardHeader, StatsSection), charts/ (ChartsSection), common/ (EmptyState, ErrorState)
│   ├── hooks/        useAdminDashboard
│   ├── utils/        chartData
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: PERIOD, PERIOD_OPTIONS, filterChartData, buildSeries, yearOptions
│
├── users/
│   ├── pages/
│   │   ├── AdminUsersView.jsx               User list (/admin/users)
│   │   └── AdminUserDetailView.jsx          User detail (/admin/users/:userId)
│   └── components/
│       ├── SubscriptionPill.jsx             Plan badge in the user table
│       ├── ProfileActivityTabs.jsx          Activity tabs on the user detail page
│       └── ActivityItems.jsx                Rows used by ProfileActivityTabs
│
├── recruitment/                             Full feature layout; see recruitment/doc/STRUCTURE.md
│   ├── pages/        AdminRecruitmentView (/admin/recruitment), AdminJobDetailView (/admin/recruitment/:jobId)
│   ├── components/   list/ (JobFilters, FilterSelect, JobsList, DeleteJobModal), detail/ (JobSidebar), common/ (ErrorBanner)
│   ├── hooks/        useAdminJobs, useAdminJobDetail
│   ├── utils/        jobsQuery
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: RECRUITMENT_PATH, jobDetailPath
│
├── messages/                                Full feature layout; see messages/doc/STRUCTURE.md
│   ├── pages/        AdminChatView (/admin/chat shell), AdminChatInboxView, AdminChatModerationView (/admin/chat/moderation)
│   ├── components/   moderation/ (ConversationList, ConversationFilters, ConversationItem, ThreadPanel, ThreadHeader, MessageItem, RemovalModals), common/ (Spinner)
│   ├── hooks/        useChatTabs, useChatModeration
│   ├── utils/        moderation
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: ADMIN_CHAT_PATH, ADMIN_CHAT_MODERATION_PATH
│
├── general/                                 Full feature layout; see general/doc/STRUCTURE.md
│   ├── pages/        AdminGeneralView (/admin/general), AdminGeneralPostDetailView (/admin/general/:postId)
│   ├── components/   list/ (PostsGrid, DeletePostModal), detail/ (PostHeader, PostBody, PostActions), common/ (ErrorBanner)
│   ├── hooks/        useAdminGeneral, useAdminGeneralPost
│   ├── utils/        generalPosts
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: GENERAL_PATH, postDetailPath
│
├── marketplace/                             Full feature layout; see marketplace/doc/STRUCTURE.md
│   ├── pages/        AdminMarketplaceView (/admin/marketplace), AdminListingDetailView (/admin/marketplace/:listingId)
│   ├── components/   list/ (CategoryFilter, ListingsGrid, DeleteListingModal), detail/ (ListingGallery, ListingInfoCard, PriceCard, SellerCard), common/ (ErrorBanner)
│   ├── hooks/        useAdminListings, useAdminListingDetail
│   ├── utils/        listings
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: MARKETPLACE_PATH, listingDetailPath
│
├── reports/                                 Full feature layout; see reports/doc/STRUCTURE.md
│   ├── pages/        AdminReportsView (/admin/reports), AdminReportDetailView (/admin/reports/:reportId)
│   ├── components/   list/ (ReportStats, ReportsTable, ReportedUserCell), detail/ (ReasonBanner, PersonCard, ReportedTarget, DecisionActions), common/ (ErrorBanner)
│   ├── hooks/        useAdminReports, useAdminReportDetail
│   ├── utils/        reports
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: REPORTS_PATH, reportDetailPath
│
├── ads/                                     Full feature layout; see ads/doc/STRUCTURE.md
│   ├── pages/        AdminAdvertisementView, AdminAdvertisementDetailView
│   ├── components/   list/ (AdsTable, AdCell), detail/ (AdHeader, AdBody, ReviewActions, AdLoadError), common/ (RejectAdModal, ErrorBanner)
│   ├── hooks/        useAdminAds, useAdminAdDetail, useAdReview
│   ├── utils/        adsQuery, adRowActions
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: ADS_PATH, adDetailPath
│
├── blogs/                                   Full feature layout; see blogs/doc/STRUCTURE.md
│   ├── pages/        AdminBlogsView (/admin/blogs), AdminCreateBlogView (/admin/blogs/new)
│   ├── components/   list/ (BlogsGrid, DeleteBlogModal), editor/ (BlogTextFields, CoverImageField, PublishOptions, EditorActions), common/ (ErrorBanner)
│   ├── hooks/        useAdminBlogs, useBlogEditor
│   ├── utils/        blogForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: BLOGS_PATH, NEW_BLOG_PATH
│
├── statistics/                              Full feature layout; see statistics/doc/STRUCTURE.md
│   ├── pages/        AdminStatisticsView (/admin/statistics)
│   ├── components/   StatisticsCharts (header, stats and states come from dashboard/)
│   ├── hooks/        useAdminStatistics
│   ├── utils/        charts
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: STATISTICS_PATH
│
├── settings/                                Full feature layout; see settings/doc/STRUCTURE.md
│   ├── pages/        AdminSettingsView (/admin/settings)
│   ├── components/   sections/ (SubscriptionSection, SponsoredSection, CategorySection), common/ (SectionHeader, PriceField, SettingsLoadError)
│   ├── hooks/        useAdminSettings, useSettingsForm
│   ├── utils/        settingsForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: SETTINGS_PATH
│
├── profile/                                 Full feature layout; see profile/doc/STRUCTURE.md
│   ├── pages/        AdminProfileView (/admin/profile)
│   ├── components/   form/ (AdminAccountForm, ProfileSummary, AvatarPicker, AccountInfoSection, PasswordSection)
│   ├── hooks/        useAdminProfile
│   ├── utils/        profileForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: PROFILE_PATH
│
├── data/
│   ├── users.js                             SUBSCRIPTION_PILL_STYLES (used by SubscriptionPill) + unused demo rows
│   ├── reports.js                           Demo data — not imported anywhere
│   ├── advertisements.js                    Demo data — not imported anywhere
│   └── settings.js                          Deprecated re-export of @/features/dash/admin/settings — not imported anywhere
│
└── doc/STRUCTURE.md
```

## Imports

- Routes (`shared/router/routes/admin.routes.jsx`) lazy-load
  `@/modules/dash/admin/<feature>/pages/<View>` directly.
- The sidebar items (`adminNavItems`) live in
  `@/components/navigation/navbar/nav.js`, used by `layouts/AdminLayout`.
- Nothing outside admin imports admin files. Every feature except `users/`
  has an `index.js`. `statistics/` imports chart helpers and overview pieces
  from the `dashboard/` index.

## Not done yet

The `hooks/`, `utils/`, `constant/`, `test/` and `doc/` split has been
applied to every feature except `users/`, which still holds its own state and
effects: `AdminUsersView` (351 lines) and `AdminUserDetailView` (309). The
unused files in `data/` can be deleted.
