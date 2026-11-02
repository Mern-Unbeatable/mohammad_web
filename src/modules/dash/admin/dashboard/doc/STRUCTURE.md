# Admin dashboard — structure

The admin overview (`/admin`): KPI cards from `@/features/dash/admin/dashboard`
(`state.adminDashboard`) and the user-growth / revenue charts from
`@/features/dash/admin/statistics` (`state.adminStatistics`) for a chosen
year, each chart with its own period.

## Folder layout

```
dashboard/
├── pages/
│   └── AdminDashboardView.jsx        Header, KPI section, charts section
│
├── index.js                          Public API: PERIOD, PERIOD_OPTIONS, filterChartData, buildSeries, yearOptions
│
├── constant/
│   └── constants.js                  Periods, year count, grid classes, chart line definitions
│
├── components/
│   ├── overview/
│   │   ├── DashboardHeader.jsx       Title + year select
│   │   └── StatsSection.jsx          StatCards with skeleton / error / empty states
│   ├── charts/
│   │   └── ChartsSection.jsx         Two LineChartCards with skeleton / error / empty states
│   └── common/
│       ├── EmptyState.jsx
│       └── ErrorState.jsx            Message + optional Retry
│
├── hooks/
│   └── useAdminDashboard.js          Loads stats + statistics per year, builds and filters series
│
├── utils/
│   └── chartData.js                  filterChartData (month injectable for tests), buildSeries, yearOptions
│
├── test/
│   ├── chartData.test.js
│   └── DashboardViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access; utils are pure.

## Notes

- `loadDashboard` is now a `useCallback` on the year, so the effect lists its
  real dependencies and the `eslint-disable` comment is gone. It still runs
  once on mount and again whenever the year changes.
- The KPI Retry reloads everything; the charts Retry only refetches
  statistics, as before.
- `AdminStatisticsView` still has its own copy of `filterChartData` and the
  period options; it can import them from this feature's `index.js`.
