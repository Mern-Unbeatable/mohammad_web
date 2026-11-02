# Supplier dashboard — structure

The supplier home (`/supplier/dashboard`): welcome banner with a create-ad
button, stat cards, a yearly activity chart, the latest ads and the latest
notifications. Data comes from `@/features/dash/supplier/dashboard`
(`state.supplierDashboard`), loaded once per chosen chart year.

## Folder layout

```
dashboard/
├── pages/
│   └── SupplierDashboardView.jsx   Wires useSupplierDashboard to the sections and CreateAdModal
│
├── constant/
│   └── constants.js                Notifications path, chart year count / height, skeleton counts, empty texts
│
├── components/
│   ├── overview/
│   │   ├── WelcomeBanner.jsx       Greeting + "Create A Advertisement"
│   │   ├── StatsGrid.jsx           Stat cards with hints, or skeletons
│   │   └── ActivityChart.jsx       BarChartCard with year select, or skeleton
│   ├── ads/
│   │   └── RecentAdsCard.jsx       Latest ads table (AdCell from the ads feature)
│   ├── notifications/
│   │   ├── RecentNotificationsCard.jsx
│   │   └── NotificationItem.jsx
│   └── common/
│       ├── SectionHeader.jsx       Card title, subtitle, "View All →" link
│       ├── EmptyState.jsx
│       └── ErrorState.jsx          Error message with Retry
│
├── hooks/
│   └── useSupplierDashboard.js     Fetch per year, retry, display name, ad row actions, create-ad modal
│
├── utils/
│   └── dashboardUtils.js           chartYearOptions, displayNameOf
│
├── test/
│   ├── dashboardUtils.test.js
│   └── SupplierDashboardView.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

There is no `index.js`: nothing outside the dashboard imports from it, and
the route lazy-loads the page directly.

## Rules

- The page only wires one hook to components; components never dispatch.
- Each section shows skeletons only while loading **and** still empty, so a
  year change keeps the current content on screen.
- Ad paths and the ad title cell come from `@/modules/dash/supplier/ads`
  (`ADS_PATH`, `adDetailPath`, `AdCell`), so the table matches the ads page.
