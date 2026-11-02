# Admin reports — structure

Reports & moderation for admins: the list (`/admin/reports`) with stat
cards, search, status filter, paging and status row actions; and the report
detail (`/admin/reports/:reportId`) with the reporter / reported user, the
reported content, moderation decisions and the audit history. Data comes from
`@/features/dash/admin/reports` (`state.adminReports`).

## Folder layout

```
reports/
├── pages/
│   ├── AdminReportsView.jsx          Header, error banner, ReportStats, ReportsTable
│   └── AdminReportDetailView.jsx     Skeleton / redirect, reason banner, people, target, decisions, history + reason modals
│
├── index.js                          Public API: REPORTS_PATH, reportDetailPath
│
├── constant/
│   └── constants.js                  Paths, page size, debounce, statuses, filter options, stat icons, decision actions + tones
│
├── components/
│   ├── list/
│   │   ├── ReportStats.jsx           StatCards or skeletons
│   │   ├── ReportsTable.jsx          DataTable: columns, search, status filter, row actions, pagination
│   │   └── ReportedUserCell.jsx      Name + warnings pill
│   ├── detail/
│   │   ├── ReasonBanner.jsx          Reason + quoted detail
│   │   ├── PersonCard.jsx            Reporter / reported user card (profile, audit buttons)
│   │   ├── ReportedTarget.jsx        Quoted reported content
│   │   └── DecisionActions.jsx       Remove / Warn / Suspend / Ban / Mark Resolved tiles
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminReports.js            Stats, debounced search, filter, paging, status changes + toasts
│   └── useAdminReportDetail.js       Load / clear, decide (moderate, ask for note, resolve), navigation, modals
│
├── utils/
│   └── reports.js                    buildReportsQuery, getReportRowActions, reasonModalCopy
│
├── test/
│   ├── reports.test.js
│   └── ReportsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, navigation and toasts; utils are pure.
- Mappers come from the `@/features/dash/admin/reports` index, not from
  `reportsMappers` directly.

## Notes

- The page reset after a search happens inside the debounce timer (only when
  the text changed), and the status filter resets it in its handler. This
  removes the `react-hooks/set-state-in-effect` lint error.
- The decision tiles are data (`DECISION_ACTIONS`); `kind` decides whether a
  tile moderates at once, opens the note dialog (Suspend / Ban) or resolves.
  This also removes the unused `Icon` lint error from the old inline component.
