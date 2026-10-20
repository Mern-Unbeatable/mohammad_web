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
├── recruitment/pages/
│   ├── AdminRecruitmentView.jsx             Job list (/admin/recruitment)
│   └── AdminJobDetailView.jsx               Job detail (/admin/recruitment/:jobId)
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
├── reports/pages/
│   ├── AdminReportsView.jsx                 Reports (/admin/reports)
│   └── AdminReportDetailView.jsx            Report detail (/admin/reports/:reportId)
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
├── statistics/pages/
│   └── AdminStatisticsView.jsx              Statistics (/admin/statistics)
│
├── settings/pages/
│   └── AdminSettingsView.jsx                Settings (/admin/settings)
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
- Nothing outside admin imports admin files. `ads/`, `blogs/`, `dashboard/`,
  `general/`, `marketplace/`, `messages/` and `profile/` have an `index.js`;
  the other features have none yet.

## Not done yet

The `hooks/`, `utils/`, `constant/`, `test/` and `doc/` split has been
applied to `ads/`, `blogs/`, `dashboard/`, `general/`, `marketplace/`,
`messages/` and `profile/`. The other views still hold their own state and
effects, and several are large: `AdminSettingsView` (463 lines),
`AdminUsersView` (351),
`AdminReportDetailView` (326), `AdminUserDetailView` (309) and
`AdminStatisticsView` (297). The unused files in `data/` can be deleted.
