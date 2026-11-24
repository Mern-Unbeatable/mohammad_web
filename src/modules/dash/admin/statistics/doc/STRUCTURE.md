# Admin statistics — structure

Full analytics (`/admin/statistics`): the KPI cards and six charts (user
growth, revenue, new users, monthly / yearly subscription revenue, new
subscribers) for a chosen year, each chart with its own period. Data comes
from `@/features/dash/admin/dashboard` and `@/features/dash/admin/statistics`.

## Folder layout

```
statistics/
├── pages/
│   └── AdminStatisticsView.jsx       DashboardHeader + StatsSection (from dashboard), StatisticsCharts
│
├── index.js                          Public API: STATISTICS_PATH
│
├── constant/
│   └── constants.js                  Path, title / subtitle, CHARTS (id, title, lines)
│
├── components/
│   └── StatisticsCharts.jsx          LineChartCards with loading / error / empty states
│
├── hooks/
│   └── useAdminStatistics.js         Loads stats + statistics per year, per-chart periods, filtered charts
│
├── utils/
│   └── charts.js                     initialPeriods, buildCharts
│
├── test/
│   ├── charts.test.js
│   └── StatisticsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Shared with the dashboard

The page reuses `@/modules/dash/admin/dashboard` (its `index.js`): the period
options and `filterChartData`, `yearOptions`, `DashboardHeader` (with a
`title` / `subtitle`), `StatsSection` (with an `emptyMessage`), `EmptyState`,
`ErrorState` and the chart grid class. The old local copies are gone.

## Notes

- Loading is a `useCallback` on the year, so the effect lists its real
  dependencies and the `eslint-disable` comment is gone. The KPI Retry reloads
  everything; the charts Retry only refetches statistics, as before.
- The chart list is built inside one `useMemo` from `statistics` and the
  periods, which removes the two `react-hooks/exhaustive-deps` warnings.
