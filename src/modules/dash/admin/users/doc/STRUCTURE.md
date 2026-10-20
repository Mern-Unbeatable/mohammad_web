# Admin users — structure

User management for admins: the users list (`/admin/users`) with role tabs,
plan / status filters, debounced search, paging and suspend / activate; and
the user detail (`/admin/users/:userId`) showing the profile, an admin-only
account card, the user's posts and their ads / listings / jobs. Data comes
from `@/features/dash/admin/users` (`state.adminUsers`); posts come from
`@/features/dash/user/feed` (`state.userFeed`) and content from
`usersApi.getUserContent`.

## Folder layout

```
users/
├── pages/
│   ├── AdminUsersView.jsx            Header, error banner, DataTable (tabs, search, filters, actions, paging), suspend modal
│   └── AdminUserDetailView.jsx       Skeleton / error card, ProfilePageContent with slots, suspend + message modals
│
├── index.js                          Public API: USERS_PATH, userDetailPath
│
├── constant/
│   └── constants.js                  Paths, page size, debounce, tabs, filter options, status maps,
│                                     toast messages, pill / status classes, activity tabs
│
├── components/
│   ├── list/
│   │   ├── userColumns.jsx           getUserColumns(isSupplierTab)
│   │   └── SubscriptionPill.jsx
│   ├── detail/
│   │   ├── AccountDetailsCard.jsx    Status, account rows, Suspend / Activate button
│   │   └── ProfileActivityTabs.jsx   Posts tab + content tabs (tab in ?tab=)
│   └── activity/
│       ├── ActivityTabBar.jsx
│       ├── ActivityItems.jsx         Skeleton, empty text or ContentRow list
│       └── ContentRow.jsx
│
├── hooks/
│   ├── useAdminUsers.js              URL state, search sync + debounce, fetch, rows, row actions, status change
│   ├── useAdminUserDetail.js         User, posts, content cache, status change, message dialog
│   └── useActivityTab.js             Active tab <-> ?tab=
│
├── utils/
│   ├── usersList.js                  readListParams, applyParamChanges, applySearch, buildUsersQuery,
│   │                                 toUserRow, toStatusUpdate, getUserRowActions
│   ├── userDetail.js                 isSupplierUser, contentKindsFor, isPremiumMember, account status / rows
│   └── activity.js                   ROW_DETAILS, buildActivityTabs, formatPrice, capitalize
│
├── test/
│   ├── usersUtils.test.js
│   └── UsersViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, API calls, navigation and toasts; utils are pure.
- List state lives in the URL (`tab`, `page`, `plan`, `status`, `q`); "all",
  empty values and page 1 are left out of the URL.

## Notes

- `SUBSCRIPTION_PILL_STYLES` moved here from `admin/data/users.js`; nothing
  imports `admin/data/users.js` any more.
- Activity rows link with `adDetailPath`, `listingDetailPath` and
  `jobDetailPath` from the ads, marketplace and recruitment indexes.
