# Supplier blogs — structure

The supplier Knowledge Hub: the blogs page (`/supplier/blogs`) with a search
hero, a "Latest From The Hub" strip and a paged "Previous Article" archive, and
the article page (`/supplier/blogs/:slug`) with a "Popular Posts" sidebar.
Data comes from `@/features/dash/supplier/blogs` (`state.supplierBlogs`).

The presentation is shared with the user hub
(`@/components/data-display/BlogHub/`, see `modules/dash/user/blogs/doc`).
The supplier version differs in:

- base path `/supplier/blogs`;
- pages render inside `<PanelPage layout="bleed">`, which cancels the panel
  gutter (`--panel-gutter`) so the hero spans edge to edge;
- skeletons only while a list is loading **and** still empty, so a refetch
  keeps the current cards on screen;
- no `invalidateBlogsList` step (the supplier slice has none).

## Folder layout

```
blogs/
├── pages/
│   ├── SupplierBlogsView.jsx       Wires useBlogsHub to the shared BlogsHub
│   └── SupplierBlogDetailView.jsx  Loading, not found, shared BlogDetail
│
├── index.js                        Public API: BLOG_BASE_PATH, blogDetailPath
│
├── constant/
│   └── constants.js                Base path, page size, debounce, popular limit
│
├── hooks/
│   ├── useBlogsHub.js              Debounced search, page, fetch latest + archive, error toast
│   └── useBlogDetail.js            Fetch by slug, not-found tracking, popular posts, error toast
│
├── utils/
│   ├── blogQueries.js              buildLatestBlogsQuery, buildBlogsQuery
│   └── blogCards.js                toBlogCards, popularPosts
│
├── test/
│   ├── blogUtils.test.js
│   └── BlogViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire one hook to the shared components; components never dispatch or toast.
- Hooks own Redux access and toasts; utils are pure.
- "Not found" is tracked per slug (`missingSlug === slug`), so it resets when
  the slug changes without a `setState` in an effect.
- A new search sets the debounced query and resets to page 1 in the same
  timer callback, so the list is fetched once (before, a search made on
  page 2 or later fetched the old page first, then page 1).
