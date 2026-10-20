# Admin dashboard module — structure

Pages behind `/admin/*`. The folders match `modules/dash/user` and
`modules/dash/supplier`: one folder per feature, page views in `pages/`,
feature-only components in `components/`. Data loading lives in
`@/features/dash/admin/*` (Redux slices and thunks).

## Folder layout

```
admin/
├── dashboard/pages/
│   └── AdminDashboardView.jsx               Overview (/admin)
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
├── messages/
│   ├── pages/
│   │   ├── AdminChatView.jsx                Chat shell (/admin/chat)
│   │   └── AdminChatInboxView.jsx           Inbox placeholder
│   └── components/
│       └── ChatModerationPanel.jsx          Moderation page (/admin/chat/moderation)
│
├── general/pages/
│   ├── AdminGeneralView.jsx                 General posts (/admin/general)
│   └── AdminGeneralPostDetailView.jsx       Post detail (/admin/general/:postId)
│
├── marketplace/pages/
│   ├── AdminMarketplaceView.jsx             Listings (/admin/marketplace)
│   └── AdminListingDetailView.jsx           Listing detail (/admin/marketplace/:listingId)
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
├── blogs/pages/
│   ├── AdminBlogsView.jsx                   Blog list (/admin/blogs)
│   └── AdminCreateBlogView.jsx              New blog (/admin/blogs/new)
│
├── statistics/pages/
│   └── AdminStatisticsView.jsx              Statistics (/admin/statistics)
│
├── settings/pages/
│   └── AdminSettingsView.jsx                Settings (/admin/settings)
│
├── profile/
│   ├── pages/
│   │   └── AdminProfileView.jsx             Own profile (/admin/profile)
│   └── components/
│       └── AdminAccountForm.jsx             Account form
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
  `@/modules/dash/admin/<feature>/pages/<View>` directly, and
  `messages/components/ChatModerationPanel` for `/admin/chat/moderation`.
- The sidebar items (`adminNavItems`) live in
  `@/components/navigation/navbar/nav.js`, used by `layouts/AdminLayout`.
- Nothing outside admin imports admin files. `ads/` has an `index.js` for
  its paths; the other features have none yet.

## Not done yet

The `hooks/`, `utils/`, `constant/`, `test/` and `doc/` split has only been
applied to `ads/`. The other views still hold their own state and effects, and
several are large: `AdminSettingsView` (463 lines), `AdminCreateBlogView`
(368), `ChatModerationPanel` (365), `AdminUsersView` (351),
`AdminReportDetailView` (326), `AdminUserDetailView` (309) and
`AdminStatisticsView` (297). The unused files in `data/` can be deleted.
