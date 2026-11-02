# Admin blogs — structure

Blog management for admins: the list (`/admin/blogs`) with paging, edit and
delete; and the editor (`/admin/blogs/new`) that creates a post, or edits the
article passed as `location.state.article`. Data comes from
`@/features/dash/admin/blogs` (`state.adminBlogs`).

## Folder layout

```
blogs/
├── pages/
│   ├── AdminBlogsView.jsx            Header with New Blog, error banner, BlogsGrid, pagination, delete modal
│   └── AdminCreateBlogView.jsx       Header, editor form (text fields, cover image, publish options, actions)
│
├── index.js                          Public API: BLOGS_PATH, NEW_BLOG_PATH
│
├── constant/
│   └── constants.js                  Paths, page size, grid class, image types / size limit, default read time
│
├── components/
│   ├── list/
│   │   ├── BlogsGrid.jsx             Skeletons, empty message or BlogAdminCard grid
│   │   └── DeleteBlogModal.jsx       ConfirmModal with the delete wording
│   ├── editor/
│   │   ├── BlogTextFields.jsx        Headline, category, excerpt, body
│   │   ├── CoverImageField.jsx       Upload area / preview with Replace & Remove, image URL input
│   │   ├── PublishOptions.jsx        Read time + "Publish immediately"
│   │   └── EditorActions.jsx         Submit + Cancel
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminBlogs.js              Fetch per page, card models, edit navigation, delete flow + toasts
│   └── useBlogEditor.js              Form fields, cover image (file or URL, blob preview cleanup), upload + save + toasts
│
├── utils/
│   └── blogForm.js                   revokeIfBlob, imageFileError, initialBlogFields, buildBlogPayload, submitLabel
│
├── test/
│   ├── blogForm.test.js
│   └── BlogsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, toasts and navigation; utils are pure.
- Mappers come from the `@/features/dash/admin/blogs` index, not from
  `blogsMappers` directly.
