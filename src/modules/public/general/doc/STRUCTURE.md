# Public General — structure

Unauthenticated SEO surface for Lab Unity General posts at `/general-posts`
(list) and `/general-posts/:postId` (detail). Separate from the member
dashboard routes under `/general`.

## Folder layout

```
general/
├── pages/
│   ├── PublicGeneralView.jsx
│   └── PublicGeneralPostDetailView.jsx
├── components/
│   ├── DocumentMeta.jsx
│   ├── GuestAuthPrompt.jsx
│   ├── GuestConversationPrompt.jsx
│   └── CategoryPills.jsx
├── hooks/
│   ├── usePublicGeneralPosts.js
│   └── usePublicGeneralPostDetail.js
├── utils/
│   ├── guestViews.js
│   └── relatedPosts.js
├── constant/constants.js
├── test/guestViews.test.js
├── index.js
└── doc/STRUCTURE.md
```

## Behaviour

- Guests can list and open General posts without signing in.
- Unique detail views are capped (~12) via `localStorage` and a server httpOnly
  cookie (`lu_guest_general_views`). Revisits of the same post do not count again.
- Logged-in users are not limited.
- Guests see “Log in to join the conversation” instead of interaction controls.
- Creates / edits / deletes remain on the authenticated General module only.
