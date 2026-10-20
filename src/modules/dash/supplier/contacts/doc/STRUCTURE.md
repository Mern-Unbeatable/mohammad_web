# Supplier contacts — structure

The supplier contacts directory (`/supplier/contacts`) with People / Pending /
Confirm / Connected tabs, search, country filter, paging, connect and accept;
and the contact profile (`/supplier/contacts/:contactId`) with connect,
message link and post reporting. Data comes from
`@/features/dash/supplier/contacts` (`state.supplierContacts`).

The layout mirrors `modules/dash/user/contacts`. The supplier version differs in:

- filters, search and page are local state, not URL params;
- page size is `GRID_PAGE_SIZE` (8), not 12;
- no error / retry state in the results, no profile posts and no
  start-conversation modal (the message button links to supplier chat);
- after connect / accept, the background refresh drops back to the last page
  if the current one no longer exists.

## Folder layout

```
contacts/
├── pages/
│   ├── SupplierContactsView.jsx        Header, filters, count, results, pagination
│   └── SupplierContactProfileView.jsx  Loading / not found, back link, profile, report modal
│
├── index.js                            Public API: CONTACTS_PATH, contactProfilePath
│
├── constant/
│   └── constants.js                    Paths, filter ids and tabs, default country, page size, grid class, debounce, empty messages
│
├── components/
│   ├── directory/
│   │   ├── DirectoryFilters.jsx        Tabs (with Confirm count), search box, country select
│   │   ├── ContactsResults.jsx         Skeleton, empty message or contact cards
│   │   └── ResultsMessage.jsx          Dashed message box
│   └── profile/
│       └── BackToDirectoryLink.jsx
│
├── hooks/
│   ├── useContactsDirectory.js         Filters, debounced search, page, fetch, connect / accept, labels
│   └── useContactProfile.js            Fetch by id, not-found tracking, connect, report state
│
├── utils/
│   ├── contactsQuery.js                buildContactsQuery, totalPagesFrom
│   └── contactsLabels.js               plural, countLabel, statusLabel, emptyMessage, requestsToConfirmLabel
│
├── test/
│   ├── contactsUtils.test.js
│   └── ContactsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire one hook to components; components never dispatch or toast.
- Hooks own Redux access and toasts; utils are pure.
- "Not found" is tracked per id (`missingId === contactId`), so it resets when
  the id changes without a `setState` in an effect.
- Other supplier code links to profiles with `contactProfilePath` from
  `@/modules/dash/supplier/contacts` (used by `SupplierJobDetailView`).
