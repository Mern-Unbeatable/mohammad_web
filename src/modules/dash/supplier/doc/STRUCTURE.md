# Supplier dashboard module — structure

Pages behind `/supplier/*`. The folders match `modules/dash/user`: one folder per
feature, page views in `pages/`, feature-only components in `components/`. Data
loading lives in `@/features/dash/supplier/*` (Redux slices and thunks).

## Folder layout

```
supplier/
├── ads/
│   ├── pages/
│   │   ├── SupplierAdsView.jsx              Ad list with status tabs, create-ad modal
│   │   └── SupplierAdDetailView.jsx         Ad detail, preview card, comments
│   ├── components/
│   │   └── AdDetailCard.jsx                 Ad card (detail page and create-ad preview)
│   └── index.js                             Public API: AdDetailCard
│
├── blogs/pages/
│   ├── SupplierBlogsView.jsx                Blog hub with search
│   └── SupplierBlogDetailView.jsx           Article page
│
├── contacts/pages/
│   ├── SupplierContactsView.jsx             Directory with filters and pagination
│   └── SupplierContactProfileView.jsx       Member profile
│
├── dashboard/pages/
│   └── SupplierDashboardView.jsx            KPI cards and charts
│
├── general/pages/
│   ├── SupplierGeneralView.jsx              Browse general posts
│   ├── SupplierMyGeneralPostsView.jsx       Own posts with edit / delete
│   └── SupplierGeneralPostDetailView.jsx    Post page
│
├── marketplace/pages/
│   └── SupplierListingsView.jsx             Listings page
│
├── messages/pages/
│   └── SupplierMessagesView.jsx             Chat layout (supplier variant)
│
├── notifications/pages/
│   └── SupplierNotificationsView.jsx        Notification list
│
├── profile/pages/
│   └── SupplierProfileView.jsx              Profile form (reuses user ProfileSetupForm)
│
├── recruitment/
│   ├── pages/
│   │   ├── SupplierRecruitmentView.jsx      Public job posts
│   │   ├── SupplierMyJobsView.jsx           Own job posts
│   │   ├── SupplierJobDetailView.jsx        Job detail and applying
│   │   └── SupplierPostJobView.jsx          Create / edit job
│   └── components/
│       └── SupplierRecruitmentActions.jsx   Browse / My jobs / Post job buttons
│
├── config/
│   └── nav.js                               Sidebar items (used by layouts/SupplierLayout)
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
  `AdDetailCard`, `config/nav` for the sidebar, and `data/advertisements` for
  ad categories.
- Supplier pages reuse user features through their public indexes:
  `@/modules/dash/user/{feed,general,recruitment,profile}`.

## Not done yet

The user module's `hooks/`, `utils/`, `constant/` and `test/` split was not
applied here. Supplier views still hold their own state and effects, and
several are large: `SupplierContactsView` (318 lines), `SupplierDashboardView`
(290), `SupplierMyJobsView` (278), `SupplierBlogsView` (271) and
`SupplierAdsView` (252). Several of them duplicate their user counterparts;
for example, `SupplierContactsView` re-implements the user `DirectoryFilters`.
Extracting hooks, or reusing the user components, is the next step.
`data/dashboard.js` and the demo ad rows in `data/advertisements.js` are unused
and can be deleted.
