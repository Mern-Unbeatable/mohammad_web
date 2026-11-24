# Admin general — structure

General posts (news and documents) for admins: the list (`/admin/general`)
with the shared category toolbar, paging and delete; and the post detail
(`/admin/general/:postId`). Data comes from `@/features/dash/admin/general`
(`state.adminGeneral`).

## Folder layout

```
general/
├── pages/
│   ├── AdminGeneralView.jsx              GeneralToolbar (from user/general), error banner, PostsGrid, pagination, delete modal
│   └── AdminGeneralPostDetailView.jsx    Skeleton / NotFound, back button, header, body, actions
│
├── index.js                              Public API: GENERAL_PATH, postDetailPath
│
├── constant/
│   └── constants.js                      Paths, page size, default category, grid class, post types and pill styles
│
├── components/
│   ├── list/
│   │   ├── PostsGrid.jsx                 Skeletons, empty message or GeneralPostCard grid
│   │   └── DeletePostModal.jsx           ConfirmModal with the delete wording
│   ├── detail/
│   │   ├── PostHeader.jsx                Cover image, type pill, title, date, category
│   │   ├── PostBody.jsx                  Paragraphs
│   │   └── PostActions.jsx               Download (documents only) + Share
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminGeneral.js                Category, paging, fetch, card models, delete flow + toasts
│   └── useAdminGeneralPost.js            Fetch by id, clear on leave → { loading, notFound, post }
│
├── utils/
│   └── generalPosts.js                   buildPostsQuery, postTypeStyle, postTypeLabel, postDownloadUrl
│
├── test/
│   ├── generalPosts.test.js
│   └── GeneralViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access and toasts; utils are pure.
- Mappers come from the `@/features/dash/admin/general` index, not from
  `generalMappers` directly.

## Notes

- Changing the category resets the page in its handler instead of in a
  separate effect, which removes the `react-hooks/set-state-in-effect` lint
  error and the extra fetch with the old page.
