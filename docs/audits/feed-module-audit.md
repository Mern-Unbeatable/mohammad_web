# Feed module — architecture & code audit

- **Scope:** `web/src/modules/dash/user/pages/feed`, its data layer `web/src/features/user/feed`,
  shell integration (`FeedActionsContext`, `MobileBottomNav`), external consumers, and the
  backend feed/upload endpoints in `server/src/modules/dash/user/feed` and `server/src/middleware/upload.ts`.
- **Date:** 2026-10-19
- **Repos touched:** `web` (frontend) and `server` (one validator change + one test).

---

## 1. Executive summary

The Feed module is in good shape structurally: rendering, hooks, pure utils and the Redux
data layer are separated, stale list responses are discarded via request ids, and the
backend enforces every ownership rule the UI relies on.

The audit found **two High-severity data-integrity/security issues** that were fixed:

1. **One malformed post could crash every feed and profile list** — `toFeedPostModel`
   called `decodeURIComponent` on the document URL, which throws on bad `%` escapes, and the
   server accepted such URLs.
2. **Post media URLs accepted any scheme** (`javascript:`, `data:`, `file:` …) on the server,
   and the client rendered the document URL as a link.

It also fixed three Medium issues (duplicate/stale error toasts, reaction request races and
over-broad rollback, a dead mobile "Post" button outside the feed) and one Low issue
(false "Link copied" success).

One further **High backend risk in the shared upload middleware** (client-controlled file
extension) and two Medium functional gaps (share links don't open the post; offset
pagination can skip posts) are reported but intentionally **not** changed — see §6 and §10.

Verification: web 509/510 tests pass (the 1 failure is pre-existing and unrelated), server
187/187 tests pass, server type-check passes, production build passes, all changed files
lint clean, and repo-wide web lint went from 41 to 40 problems.

---

## 2. Existing architecture and actual data flow

### Fetching and pagination

1. `FeedView` → `useFeedPosts(filter)` builds `{ page: 1, pageSize: 20, sort: "desc", type? }`.
2. On mount / filter change (`useLayoutEffect`) it dispatches `invalidateFeedPosts()` then
   `fetchFeed(query)` (`features/user/feed/feedThunks.js`) → `feedApi.getFeed` → `GET /feed`.
3. `feedSlice` stores raw posts; `fetchFeed.fulfilled` is applied only if
   `action.meta.requestId === state.postsRequestId`, so a slow response for an old filter is dropped.
4. "Load more" dispatches `fetchMoreFeed({ ...query, page: n + 1 })`; its thunk `condition`
   blocks overlapping requests and the reducer merges with `appendUnique` (dedupe by id).
5. `useFeedPosts` maps raw posts to card models with `toFeedPostModel` (memoized on `posts`).

### Mutations

| Action | Hook | Thunk / endpoint | Store effect |
|---|---|---|---|
| React | `usePostEngagement.react` | `reactToPost` → `POST /feed/:id/reactions` | `mapAllPosts` patches the post in every list |
| Comment add | `usePostCommentActions.add` | `addComment` → `POST /feed/:id/comments` | inserted into the post (or under its root) in every list |
| Comment like / edit / delete | `usePostCommentActions` | `likeComment` / `editComment` / `removeComment` | patched / stripped in every list |
| Repost / undo | `useRepost` | `repostPost` / `undoRepost` → `POST/DELETE /feed/:id/repost` | prepends repost; syncs `sharedByMe` + share count |
| Create | `useCreatePost` (+ `usePostDraft` uploads) | `createPost` → `POST /feed` | upsert at top, refresh first page |
| Edit | `usePostEditor` (`modules/dash/user/hooks`) | `updatePost` → `PATCH /feed/:id` | replace in place |
| Delete | `usePostDeletion` / `ProfileView` | `removePost` → `DELETE /feed/:id` | removed from every list |

### Per-card state

`FeedPost` keeps an optimistic copy of stats, comments and reaction in `usePostEngagement`.
It resets during render whenever the store's `post` object changes, so every store update
(including the server reconciliation of the card's own actions) wins. Lists key cards by
`post.id`, so state cannot leak between posts.

---

## 3. Module structure and dependency boundaries

```
feed/
├── FeedView.jsx            page composition
├── index.js                public API (FeedPost, PostActions, PostStats, PostComments,
│                           CreatePostModal, ReportPostModal, LoadMorePosts)
├── constants.js            limits, filters, badges, accepted file types
├── components/{post,comments,composer,modals}/   UI only
├── hooks/                  state, effects, Redux dispatch, toasts
├── utils/                  pure functions (commentTree, reactions, postDraft, mentions, …)
├── test/
└── doc/STRUCTURE.md
```

Verified boundaries:

- Components do not dispatch feed thunks; all post/comment actions go through hooks.
- `utils/` files import only constants and each other (no React, no network).
  The new `utils/postDraft.js` keeps that rule; network uploads stay in `hooks/usePostDraft.js`.
- External code imports only from `@/modules/dash/user/pages/feed` (index) — the single deep
  import is the lazy route `FeedView`, which is expected.
- No circular imports between feed folders; the feed depends on `@/features/user/feed`
  (data layer), never the reverse.

---

## 4. Findings

| ID | Severity | Area | Affected files | Evidence | Impact | Recommendation / status |
|---|---|---|---|---|---|---|
| F-01 | **High** | Security | `server/.../feed.validators.ts`, `features/user/feed/feedMappers.js`, `components/post/AttachmentCard.jsx` | `imageUrls`, `imageUrl`, `documentUrl` validated only with `z.string().url()`, which accepts any parseable scheme. `AttachmentCard` renders `<a href={attachment.url} target="_blank">`. | A member calling the API directly could store `javascript:`/`data:` links shown to every viewer. Whether React 19.2 neutralises `javascript:` hrefs in this build was **not verified**; other schemes are not blocked by React. | **Fixed** — server accepts only `http(s)`; client mapper drops non-`http(s)` / non-root-relative media URLs (defence for existing rows). |
| F-02 | **High** | Data integrity | `features/user/feed/feedMappers.js` (`toFeedPostModel`) | Document name derived with `decodeURIComponent(url.split("/").pop())` — throws `URIError` on malformed escapes; server accepted such URLs. | One post makes `useFeedPosts`' `useMemo` (and profile/admin lists) throw → whole list fails to render for every viewer. | **Fixed** — safe decode with fallback; query/hash stripped from names. |
| F-03 | Medium | Reliability / UX | `hooks/useFeedPosts.js`, `features/user/feed/feedSlice.js` | `useFeedPosts` toasted `state.userFeed.error`, which the slice also sets for `createPost`, `removePost`, `reactToPost`, `addComment`, `likeComment`, `fetchMoreMyPosts`, `fetchPostDetails` rejections — whose callers already toast. | Duplicate error toasts on the feed; an error left by another page can toast on the next feed visit. | **Fixed** — the hook now toasts only the results of its own list requests (skipping thunk-`condition` cancellations). |
| F-04 | Medium | State / concurrency | `hooks/usePostEngagement.js` | No in-flight guard; the server toggles (`feedService.react`: same type ⇒ delete). Rollback did `setState(previous)`. | Rapid repeat clicks send overlapping toggles reconciled in arrival order; a failed reaction rolled back unrelated comment/stat updates made meanwhile; clearing with no reaction would send "like". | **Fixed** — one request per card at a time, rollback restores only reaction fields, no request when nothing to change. Transitions moved to pure `utils/reactions.js`. |
| F-05 | Medium | Functional | `modules/dash/user/context/FeedActionsContext.jsx`, `hooks/useCreatePost.js`, `components/shell/MobileBottomNav.jsx` | `registerOpenCreatePost` stored a handler that was never cleared; the mobile "Post" tab is shown on every user page. | Outside `/feed` the tab called an unmounted page's setter — tapping it did nothing. | **Fixed** — registration returns an unregister; with no feed mounted the tab navigates to `/feed` and opens the dialog when the feed registers. |
| F-06 | Medium | Functional | `components/modals/SharePostModal.jsx`, `server/.../feed.service.ts` (`addComment` notification) | Share URL is `/feed?post=<id>` but nothing reads `post`; comment notifications link to `/feed`. `fetchPostDetails` exists but no user-feed view uses it. | Shared/sent links and notifications land on the top of the feed, not the post. | **Not fixed** — needs a new post-detail route/UI (product decision). |
| F-07 | Medium | Data consistency | `features/user/feed/feedThunks.js` (`fetchMoreFeed`), `feedSlice.js` (`appendUnique`) | Offset pages (`page + 1`). Inserts are deduped, but deletions by others between pages shift offsets. | A post can be silently skipped on "Load more". | **Not fixed** — needs cursor pagination (`createdAt,id`) on the server. |
| F-08 | **High** (backend) | Security | `server/src/middleware/upload.ts` | Stored filename keeps `path.extname(file.originalname)`; `fileFilter` trusts the client-declared `file.mimetype`. | A file like `x.html` / `x.svg` declared as `image/png` is stored with its own extension and served from the upload directory — possible stored XSS on the upload origin depending on static headers (**not verified**). | **Not fixed** (shared by all upload features) — derive the extension from a validated MIME/magic bytes, serve uploads with `X-Content-Type-Options: nosniff` and `Content-Disposition: attachment` for documents. |
| F-09 | Low | UX / correctness | `components/modals/SharePostModal.jsx` | Clipboard failure was swallowed and "Link copied" shown; `setTimeout(onClose)` not cleared on unmount; caption limit duplicated as `5000`. | False success on insecure contexts; late `onClose` after unmount. | **Fixed** — error toast on failure, timers cleared, uses `MAX_POST_LENGTH`. |
| F-10 | Low | Accessibility | `components/post/ReactionButton.jsx` | Picker opens on mouse hover or long-press only; keyboard Enter/Space toggles Like. | Keyboard users can't choose other reactions. | **Not fixed** — add a keyboard trigger (e.g. ArrowUp) with roving focus in the menu. |
| F-11 | Low | Consistency | `modules/dash/supplier/pages/SupplierAdDetailView.jsx` | Uses `PostComments` with in-memory comments (`replies: 0` number), ignores `parentCommentId`, passes no `currentUser`. | Supplier ad comments aren't persisted; replies become top-level. | **Not fixed** — existing product behaviour; component stays compatible. |
| F-12 | Low | Performance | `components/post/FeedPost.jsx` | Every card selects global `likingCommentId`. | All memoized cards re-render when any comment like starts/ends. | **Not fixed** — not profiled; select it only while comments are open if profiling shows cost. |
| F-13 | Low | Data hygiene | `hooks/usePostDraft.js` (`publish`) | Uploads run before `onPublish`; on publish failure a retry uploads again. | Orphaned uploaded files. | **Not fixed** — cache uploaded URLs per draft image or clean up server-side. |
| F-14 | Low | Maintainability | `features/user/feed/feedSlice.js` | `error`, `reactingId`, `commenting` have no UI consumers after F-03. | Dead state. | **Not fixed** — slice-wide cleanup; existing slice tests assert `error`. |
| F-15 | Low | Repo hygiene | `web/vite.config.js` | Unused `createRequire` / `require` left from the earlier malware clean-up (lint error). File inspected: 1015 chars, no payload. | Lint noise; pattern previously used to load `api.js`. | **Not fixed** — outside feed scope; remove the two lines. |

---

## 5. Changes implemented

| Change | Files | Rationale |
|---|---|---|
| Safe document-name decoding; `isSafeMediaUrl` filter for images, documents and provided attachments | `web/src/features/user/feed/feedMappers.js` | F-02, F-01 (client defence for existing data). Same-origin paths (`/uploads/…`) still allowed. |
| `http(s)`-only media URLs on create/update | `server/src/modules/dash/user/feed/feed.validators.ts` | F-01 at the source. Seed data uses absolute `http(s)` URLs, so no existing flow breaks. |
| `useFeedPosts` toasts only its own request results | `hooks/useFeedPosts.js` | F-03; removes duplicate/stale toasts without changing the slice contract other pages use. |
| Reaction guard, scoped rollback, pure transitions (`planReaction`, `applyReaction`, `rollbackReaction`, `reconcileReaction`) | `hooks/usePostEngagement.js`, `utils/reactions.js` | F-04; makes the rules testable without a DOM. |
| Composer rules extracted (`pickImageFiles`, `hasDraftChanges`, `getShownDocument`, `getSubmitLabel`, `mergeUploadedImageUrls`, `getInitialDraft`) | `utils/postDraft.js`, `hooks/usePostDraft.js` | Testable validation/business rules; hook keeps state, toasts and network only. Behaviour unchanged. |
| Unregister + navigate-and-open for the create-post opener; hook moved to its own file | `modules/dash/user/context/FeedActionsContext.jsx`, `modules/dash/user/context/useFeedActions.js`, `hooks/useCreatePost.js`, `components/shell/MobileBottomNav.jsx` | F-05; the split also fixes the existing `react-refresh/only-export-components` lint error. |
| Clipboard failure handling, timer cleanup, shared caption limit | `components/modals/SharePostModal.jsx` | F-09. |
| Structure doc updated | `feed/doc/STRUCTURE.md` | New util and tests listed. |

No public exports, component props, routes, API contracts or visual design changed.

---

## 6. Intentionally left unchanged

- **F-06, F-07, F-08** — require new UI, server pagination changes, or changes to the
  upload middleware shared by every feature; too broad/risky for this change set.
- **F-10 – F-15** — low impact; recommendations above.
- **`usePostEngagement` duplicated state** — deliberate: it holds optimistic values and
  is reset from the store on every post change, so the store remains the source of truth.
- **Comment like concurrency** — already prevented: `CommentBody` disables the like button
  while `likingCommentId` matches.
- **Draft preservation on failure** — already correct: `CommentComposer`, `InlineReplyBox`
  and `CommentEditForm` keep input when the handler resolves `false`; `useCreatePost` and
  `usePostEditor` close the dialog only on success.
- **Feed list races** — already handled by request ids and the `fetchMoreFeed` condition.
- **Authorization** — enforced server-side (`feed.service.ts`): post edit = author only;
  post/comment delete = author or `ADMIN`; comment edit = author only; repost of own post
  rejected; replies re-parented to the root comment; reactions/comment likes keyed per user.
  The frontend's hidden menus are convenience only.
- **User content rendering** — no `dangerouslySetInnerHTML` anywhere in `web/src`; comments
  and posts render as text (mentions are highlighted by `ExpandableText`, not parsed as HTML).

---

## 7. Test coverage added

| Test file | Tests | Covers |
|---|---|---|
| `feed/test/commentTree.test.js` | 11 | find (nested/missing), root lookup, immutable update, delete root (+reply count), delete reply (parent count), unknown id, preview limit + pinned new comments |
| `feed/test/reactions.test.js` | 10 | API mapping incl. legacy ids, toggle planning (add/switch/remove/clear/no-op), totals, optimistic apply, rollback preserving concurrent comment/stat changes, server reconciliation, missing fields |
| `feed/test/postDraft.test.js` | 12 | initial draft (new/edit/unsafe attachment), image type filter, per-post limit, change detection (whitespace, order, new images, document), shown document, submit labels, upload URL order |
| `features/user/feed/feedMappers.test.js` (+5) | 5 | document name from URL, malformed `%` escape doesn't throw, unsafe document/image URLs dropped, unsafe provided attachment URL cleared, rules apply inside reposts |
| `server/tests/feed.update.test.ts` (+1) | 1 | `javascript:`, `data:`, `file:` rejected for `documentUrl`, `imageUrls`, `imageUrl` on create and update; `https` and `null` still accepted |

**Not covered by automated tests** (the web project has no DOM test environment — no jsdom or
Testing Library; existing component tests use `renderToStaticMarkup`):

- Hook wiring: the reaction in-flight guard, `useFeedPosts` toast behaviour, `usePostDraft`
  upload/publish flow, `usePostCommentActions` dispatch/rollback paths.
- `FeedActionsProvider` navigate-and-open, `SharePostModal` clipboard/timer behaviour.
- Focus management and keyboard behaviour in modals.

Recommendation: add `jsdom` + `@testing-library/react` as dev dependencies to test hooks and
interactions; this was not done here to avoid introducing dependencies without sign-off.

---

## 8. Verification results (all executed)

| Check | Baseline (before) | After |
|---|---|---|
| Web feed + data-layer tests | not run separately (covered by the full-suite baseline; 77 existing tests = 115 − 38 added) | **115 passed** (12 files) |
| Web full suite (`vitest run`) | 471 / 472 | **509 / 510** — same single failure: `ContactCard.test.jsx › uses the same brand cover colour for every member without a cover photo` (pre-existing, unrelated) |
| Web lint, changed files (`eslint` on feed, data layer, context, shell nav, layout) | 1 error (`FeedActionsContext.jsx`, fast-refresh rule) | **0 problems** |
| Web lint, whole repo (`eslint .`) | 41 problems (36 errors, 5 warnings) | **40 problems** (35 errors, 5 warnings) — all remaining are in files not touched here |
| Web type-check | n/a — JavaScript project, no `tsconfig`/type-check script | n/a |
| Web production build (`vite build`) | passed | **passed** |
| Server type-check (`tsc --noEmit`) | passed | **passed** |
| Server lint (`eslint src/modules/dash/user/feed`) | — | **passed** |
| Server feed tests | 57 passed | **58 passed** |
| Server full suite (`vitest run`, Prisma mocked) | — | **187 / 187 passed** |

Diff review: `git status`/`git diff` in both repos show only the files listed in §5 and §7;
no debug code, no line-ending churn, no unrelated modifications.

**Requires manual / authenticated verification:**

- Tap the mobile "Post" tab from `/contacts` → lands on `/feed` with the dialog open.
- Rapidly click a reaction → one request at a time; failure toast restores the reaction only.
- Trigger a failed comment/reaction/delete on the feed → exactly one error toast.
- Copy link on `http://` (non-secure) origin → error toast, no "Link copied".
- Create/edit a post with `https` uploads still works against the real API.

---

## 9. Compatibility assessment

| Consumer | Uses | Impact |
|---|---|---|
| `ProfileView` (own profile) | `CreatePostModal`, `ReportPostModal`, `ActivitySection` → `FeedPost`, `LoadMorePosts` | Props unchanged. Composer behaviour identical (rules moved to utils, covered by existing edit-mode tests). |
| `ContactProfileView`, `ContactProfilePageContent` | `ReportPostModal`, `ActivitySection`, `toFeedPostModel` | Unchanged API; unsafe media URLs now hidden, malformed URLs no longer crash. |
| `SupplierContactProfileView` | `ReportPostModal` | Untouched. |
| `SupplierAdDetailView` | `PostComments` | Untouched component; local-handler contract (`onAddComment` may return `undefined`) still honoured. |
| `AdDetailCard` (supplier ads) | `PostActions`, `PostStats` | Untouched. |
| `AdminUserDetailView`, `ProfilePageContent` | `toFeedPostModel` | Same as contact profile. |
| `MobileBottomNav`, `UserLayout` | `useFeedActions`, `FeedActionsProvider` | Import path for the hook moved to `@/modules/dash/user/context/useFeedActions`; both importers updated. Provider export and location unchanged. |

`index.js` exports are unchanged (verified by the existing `FeedPost.repost` test that goes
through `ActivitySection`, and by the build).

---

## 10. Remaining risks and next steps

1. **Fix the upload middleware (F-08)** — derive extensions from validated content, add
   `nosniff` / `attachment` headers on the uploads static route. Highest remaining risk.
2. **Post permalinks (F-06)** — add a post-detail route (reuse `fetchPostDetails`) and point
   share links and comment notifications at it.
3. **Cursor pagination (F-07)** for the feed list.
4. **DOM test environment** to cover hook wiring, modal focus and keyboard flows.
5. **Keyboard-accessible reaction picker (F-10).**
6. Clean up dead slice state (F-14) and the `vite.config.js` leftover (F-15).
7. Consider tightening the server further to only accept URLs on the configured upload
   origin (`env.upload.publicUrl`) rather than any `http(s)` host.
