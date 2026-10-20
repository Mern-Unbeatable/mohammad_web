# Supplier blogs — structure

The supplier Knowledge Hub: the blogs page (`/supplier/blogs`) with a search
hero, a "Latest From The Hub" strip and a paged "Previous Article" archive, and
the article page (`/supplier/blogs/:slug`) with a "Popular Posts" sidebar.
Data comes from `@/features/dash/supplier/blogs` (`state.supplierBlogs`).

The layout mirrors `modules/dash/user/blogs`. The supplier version differs in:

- base path `/supplier/blogs`;
- `BLEED_CLASS` wrapper (`-m-4 sm:-m-5 lg:-m-6`) that cancels the panel padding;
- skeletons only while a list is loading **and** still empty, so a refetch
  keeps the current cards on screen;
- no `invalidateBlogsList` step (the supplier slice has none).

## Folder layout

```
blogs/
├── pages/
│   ├── SupplierBlogsView.jsx       Wires useBlogsHub to the hero, latest and archive sections
│   └── SupplierBlogDetailView.jsx  Loading, not found, article + popular posts
│
├── index.js                        Public API: BLOG_BASE_PATH, blogDetailPath
│
├── constant/
│   └── constants.js                Routes, page size, grid class, debounce, carousel sizes, popular limit, bleed class
│
├── components/
│   ├── hub/
│   │   ├── BlogsHero.jsx           Badge, headline, search input, "Explore Articles"
│   │   ├── LatestHubSection.jsx    Snap carousel on mobile, grid from md up
│   │   ├── CarouselControls.jsx    Mobile previous / next arrows
│   │   └── ArchiveSection.jsx      Paged grid of older articles
│   ├── detail/
│   │   ├── BlogArticle.jsx         Back link, title, meta line, cover image, body
│   │   └── PopularPosts.jsx        Sidebar list of other articles
│   └── layout/
│       └── BlogDetailPage.jsx      Narrow page frame for the article and its skeleton
│
├── hooks/
│   ├── useBlogsHub.js              Debounced search, page, fetch latest + archive, error toast
│   ├── useHubCarousel.js           Carousel ref and one-card scroll
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

- Pages only wire one hook to components; components never dispatch or toast.
- Hooks own Redux access and toasts; utils are pure.
- "Not found" is tracked per slug (`missingSlug === slug`), so it resets when
  the slug changes without a `setState` in an effect.
- A new search sets the debounced query and resets to page 1 in the same
  timer callback, so the list is fetched once (before, a search made on
  page 2 or later fetched the old page first, then page 1).
