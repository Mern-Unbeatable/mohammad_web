# Supplier dashboard module — structure

Pages behind `/supplier/*`. The folders match `modules/dash/user`: one folder per
feature, page views in `pages/`, feature-only components in `components/`. Data
loading lives in `@/features/dash/supplier/*` (Redux slices and thunks).

## Folder layout

```
supplier/
├── ads/                                     Full feature layout; see ads/doc/STRUCTURE.md
│   ├── pages/        SupplierAdsView, SupplierAdDetailView
│   ├── components/   list/ (AdsTable, AdCell), detail/ (AdDetailCard, RejectionNotice, BackToAdsLink, AdComments)
│   ├── hooks/        useSupplierAds, useSupplierAdDetail, useAdEngagement
│   ├── utils/        adsQuery, adRowActions, localComments
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: AdDetailCard, AdCell, ADS_PATH, adDetailPath
│
├── blogs/                                   Full feature layout; see blogs/doc/STRUCTURE.md
│   ├── pages/        SupplierBlogsView, SupplierBlogDetailView
│   ├── (presentation shared with user blogs: @/components/data-display/BlogHub)
│   ├── hooks/        useBlogsHub, useBlogDetail
│   ├── utils/        blogQueries, blogCards
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: BLOG_BASE_PATH, blogDetailPath
│
├── contacts/                                Full feature layout; see contacts/doc/STRUCTURE.md
│   ├── pages/        SupplierContactsView, SupplierContactProfileView
│   ├── components/   directory/ (DirectoryFilters, ContactsResults, ResultsMessage), profile/ (BackToDirectoryLink)
│   ├── hooks/        useContactsDirectory, useContactProfile
│   ├── utils/        contactsQuery, contactsLabels
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: CONTACTS_PATH, contactProfilePath
│
├── dashboard/                               Full feature layout; see dashboard/doc/STRUCTURE.md
│   ├── pages/        SupplierDashboardView
│   ├── components/   overview/ (WelcomeBanner, StatsGrid, ActivityChart), ads/ (RecentAdsCard), notifications/ (RecentNotificationsCard, NotificationItem), common/ (SectionHeader, EmptyState, ErrorState)
│   ├── hooks/        useSupplierDashboard
│   ├── utils/        dashboardUtils
│   └── constant/ test/ doc/
│
├── general/                                 Full feature layout; see general/doc/STRUCTURE.md
│   ├── pages/        SupplierGeneralView, SupplierMyGeneralPostsView, SupplierGeneralPostDetailView
│   ├── components/   posts/ (SupplierGeneralToolbar, PostsGrid, PostsEmptyState), detail/ (BackToGeneralLink, GeneralPostHeader, GeneralPostBody, PostActions)
│   ├── hooks/        usePostsListing, useGeneralPostsState, useGeneralPosts, useMyGeneralPosts, useGeneralPostDetail
│   ├── utils/        generalQueries, postForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: GENERAL_PATH, generalPostPath
│
├── messages/pages/
│   └── SupplierMessagesView.jsx             Chat layout (supplier variant)
│
├── notifications/pages/
│   └── SupplierNotificationsView.jsx        Notification list
│
├── profile/                                 See profile/doc/STRUCTURE.md
│   ├── pages/        SupplierProfileView (reuses user ProfileSetupForm)
│   ├── hooks/        useSupplierProfile
│   ├── utils/        profileForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: PROFILE_PATH
│
├── recruitment/                             Full feature layout; see recruitment/doc/STRUCTURE.md
│   ├── pages/        SupplierRecruitmentView, SupplierMyJobsView, SupplierJobDetailView, SupplierPostJobView
│   ├── components/   layout/ (RecruitmentHeader, RecruitmentActions, BackLink), form/ (JobFormCard, JobFormLoading)
│   ├── hooks/        usePublicJobs, useMyJobs, useMyApplications, useJobDetail, useApplyToJob, useJobForm
│   ├── utils/        applications, jobForm
│   ├── constant/ test/ doc/
│   └── index.js                             Public API: JOB_BASE, MY_JOBS_PATH, jobDetailPath
│
├── data/
│   ├── advertisements.js                    AD_CATEGORIES, getCategoryById (used by CreateAdModal) + demo ad rows
│   └── dashboard.js                         Demo dashboard data — not imported anywhere
│
└── doc/STRUCTURE.md
```

## Imports

- Routes (`shared/router/routes/supplier.routes.jsx`) lazy-load
  `@/modules/dash/supplier/<feature>/pages/<View>` directly.
- Code outside supplier imports `@/modules/dash/supplier/ads` (index) for
  `AdDetailCard`, and `data/advertisements` for ad categories.
- The sidebar items (`supplierNavItems`) live in
  `@/components/navigation/navbar/nav.js`, used by `layouts/SupplierLayout`.
- Supplier pages reuse user features through their public indexes:
  `@/modules/dash/user/{feed,general,recruitment,profile}`.

## Not done yet

`data/dashboard.js` and the demo ad rows in `data/advertisements.js` are unused
and can be deleted.
