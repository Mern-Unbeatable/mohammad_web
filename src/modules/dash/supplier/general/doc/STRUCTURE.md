# Supplier general — structure

The supplier General board: browse posts (`/supplier/general`), the supplier's
own posts with create / edit / delete (`/supplier/general/my-posts`), and the
post page (`/supplier/general/:postId`). Data comes from
`@/features/dash/supplier/general` (`state.supplierGeneral`).

The layout mirrors `modules/dash/user/general`. The supplier version differs in:

- pages sit in `PanelPage` instead of the user `DashboardPage` frame;
- the shared `GeneralToolbar` and `CreateGeneralPostModal` come from
  `@/modules/dash/user/general`, with the toolbar pointed at supplier routes;
- both lists clear the current cards before a category or page change
  (`usePostsListing`), so skeletons show instead of stale posts.

## Folder layout

```
general/
├── pages/
│   ├── SupplierGeneralView.jsx           Toolbar, posts grid, create modal
│   ├── SupplierMyGeneralPostsView.jsx    Toolbar, own posts with edit / delete, create-edit and delete modals
│   └── SupplierGeneralPostDetailView.jsx Loading / not found, back link, header, body, actions
│
├── index.js                              Public API: GENERAL_PATH, generalPostPath
│
├── constant/
│   └── constants.js                      Paths, toolbar view ids, default category, page size, grid class, post type styles
│
├── components/
│   ├── posts/
│   │   ├── SupplierGeneralToolbar.jsx    Shared toolbar with supplier hrefs
│   │   ├── PostsGrid.jsx                 Skeleton, empty state or cards + pagination
│   │   └── PostsEmptyState.jsx
│   └── detail/
│       ├── BackToGeneralLink.jsx
│       ├── GeneralPostHeader.jsx         Cover, type badge, title, date, category
│       ├── GeneralPostBody.jsx           Paragraphs or summary
│       └── PostActions.jsx               Download (documents) and Share
│
├── hooks/
│   ├── usePostsListing.js                Category + page, fetch, reload page 1 after create
│   ├── useGeneralPostsState.js           Store posts as card models, error toast
│   ├── useGeneralPosts.js                Browse page + create modal
│   ├── useMyGeneralPosts.js              My posts + create / edit modal + delete flow
│   └── useGeneralPostDetail.js           Fetch by id, not-found tracking, share link
│
├── utils/
│   ├── generalQueries.js                 buildPostsQuery
│   └── postForm.js                       buildPostPayload (validation + edit image clearing)
│
├── test/
│   ├── generalUtils.test.js
│   └── GeneralViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire one hook to components; components never dispatch or toast.
- Hooks own Redux access and toasts; utils are pure.
- "Not found" is tracked per id (`missingId === postId`), so it resets when
  the id changes without a `setState` in an effect.
