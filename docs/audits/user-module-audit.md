# User dashboard module audit (`src/modules/dash/user`)

- **Date:** 2026-10-20
- **Scope:** every folder under `web/src/modules/dash/user`, plus the code
  outside it that imports from it.
- **Method:** file and line counts, import-graph scan (static imports,
  `vi.mock`, lazy `import()`), export usage scan for `data/`, and
  `vitest` / `eslint` on the folder. Nothing was changed while auditing.

## 1. Summary

The module is in good shape. Eleven features follow the same layout
(`pages/`, `components/`, `hooks/`, `utils/`, `constant/`, `test/`, `doc/`,
`index.js`), and page views are thin (5–111 lines). All 39 test files
(277 tests) pass, and ESLint reports nothing.

The main problems are outside the per-feature folders:

1. **`data/` mixes three kinds of content:** real configuration, display
   helpers and leftover demo data. 24 of its exports are not used anywhere
   outside `data/`. Demo values also leak into real output: listing seller
   fallbacks and default profile props.
2. **Shared code depends on a feature module.** 11 files in `src/Components`
   import from `modules/dash/user`, and 10 of them reach past a feature's
   `index.js` into its internals or `data/`.
3. **Small layout inconsistencies:** `feed/constants.js` is not in
   `constant/`, `feed/context/` is the only `context` folder, and `messages`
   has no `index.js` or doc.

## 2. Inventory

| Feature         | Files | JS/JSX lines | Views | Components | Hooks | Utils | Test files | `constant/` | `doc/` | `index.js` |
| --------------- | ----: | -----------: | ----: | ---------: | ----: | ----: | ---------: | :---------: | :----: | :--------: |
| `blogs`         |    20 |          624 |     2 |          7 |     3 |     2 |          3 | yes | yes | yes |
| `contacts`      |    19 |        1,132 |     2 |          6 |     2 |     2 |          4 | yes | yes | yes |
| `feed`          |    58 |        3,688 |     1 |         25 |    12 |     8 |          7 | root `constants.js` | yes | yes |
| `general`       |    21 |          812 |     3 |          7 |     4 |     2 |          2 | yes | yes | yes |
| `marketplace`   |    43 |        2,422 |     5 |         13 |     9 |     5 |          8 | yes | yes | yes |
| `messages`      |     1 |            5 |     1 |          0 |     0 |     0 |          0 | no  | no  | no  |
| `notifications` |    10 |          226 |     1 |          4 |     1 |     0 |          1 | yes | yes | yes |
| `profile`       |    20 |          981 |     2 |          5 |     4 |     3 |          3 | yes | yes | yes |
| `recruitment`   |    38 |        2,754 |     4 |         14 |     7 |     4 |          6 | yes | yes | yes |
| `search`        |    16 |          623 |     1 |          7 |     1 |     2 |          2 | yes | yes | yes |
| `subscription`  |    17 |          715 |     1 |          5 |     3 |     2 |          3 | yes | yes | yes |
| `data`          |     9 |        1,341 |     — |          — |     — |     — |          0 | —   | no  | no  |
| **Total**       | **272** | **15,323** | **23** |       |       |       |     **39** |     |     |     |

The largest non-test files are listed below. None is a problem on its own;
the first two are the best candidates for splitting.

| Lines | File |
| ----: | ---- |
| 312 | `recruitment/components/form/JobPostForm.jsx` (local `Field`, `SelectField`, `FormSection`, radio group) |
| 259 | `profile/components/setup/ProfileSetupForm.jsx` |
| 298 / 294 / 265 | `data/marketplace.js`, `data/dashboard.js`, `data/blogs.js` (mostly demo records) |
| 183 | `contacts/hooks/useContactsDirectory.js` |
| 158 | `feed/components/post/ReactionButton.jsx` |
| 154 / 141 | `recruitment/hooks/useMyJobs.js`, `recruitment/hooks/usePublicJobs.js` |

## 3. Findings

### 3.1 `data/` folder (high priority)

`data/` has no `index.js` or doc, and its nine files hold three kinds of
content:

| Kind | Examples | Used by |
| ---- | -------- | ------- |
| Real option lists and config | `marketplace.categories/conditions/years`, `recruitment.levels`, `general.generalCategories`, `subscription.profileCountries`, `dashboard.reportReasons`, `reactions.reactions/getReaction`, `blogs.categoryStyles` | Toolbars, forms, the report modal, reactions |
| Formatting helper | `marketplace.formatPrice` | `ListingCard`, `ListingPriceCard`, `AdminListingDetailView`, `search/utils/searchResults` |
| Demo records | `listings`, `jobs`, `feedPosts`, `generalPosts`, `latestArticles`, `notifications`, `currentUser`, … | Mostly nothing (see below) |

**Unused exports.** These 24 exports are referenced nowhere outside `data/`:

- `blogs.js`: `latestArticles`, `archiveArticles`, `allArticles`,
  `getArticleBySlug`, `featuredArticle`
- `dashboard.js`: `feedFilters`, `jobItems`
- `general.js`: `generalAuthor`, `generalPosts`, `filterGeneralPosts`,
  `getGeneralPostById`, `getMyGeneralPosts`
- `marketplace.js`: `defaultSavedIds`, `filterListings`, `getMyListings`
- `productImages.js`: all three exports, which are only used by other
  `data/` files
- `reactions.js`: `REACTION_IDS`
- `recruitment.js`: `employmentTypes`, `filterJobs`, `getMyJobs`
- `subscription.js`: `membershipFeatures`, `billingPlans`

`dashboard.feedPosts` is still imported by `modules/dash/admin/data/reports.js`
and `users.js`, which are themselves admin demo data.

**Demo data reaches real output:**

- `marketplace/utils/listingForm.js` → `listingSeller()` falls back to the
  demo `currentUser.name`, `.company` and `.location` when the signed-in
  user's profile has no company or location. A real user with an empty
  profile would see the demo person's company in the seller line of the
  listing form.
- `Components/data-display/ProfileHero` and `ProfilePageContent` use the
  demo `currentUser` as the default `user` prop. Any caller that omits
  `user` renders the demo person instead of an empty or loading state.

**Recommendation:**

1. Move the real option lists into the owning feature's
   `constant/constants.js`. Examples: marketplace categories, conditions and
   years go to `marketplace/constant`; `levels` to `recruitment/constant`;
   `reportReasons` next to `ReportPostModal`; `profileCountries` to a shared
   constant, since profile and supplier both use it.
2. Move `formatPrice` to `shared/utils` (it is used by four modules).
3. Replace the `currentUser` fallbacks with empty values, then delete the
   unused demo exports and `productImages.js`.

### 3.2 Shared components depend on feature internals (medium)

`src/Components` is the shared layer, yet 11 of its files import from the
user feature module (17 imports in total):

| Shared file | Imports |
| ----------- | ------- |
| `modals/feed/CreatePostModal.jsx` | 7 feed internals: `components/composer/{ComposerFooter,DraftDocumentCard,DraftImageGrid,PostTypeChips}`, `constants`, `hooks/usePostDraft`, `utils/postTypeOptions` |
| `modals/feed/SharePostModal.jsx` | `feed/constants` |
| `modals/feed/ReportPostModal.jsx` | `data/dashboard` |
| `modals/recruitment/AllCandidatesModal.jsx` | `recruitment/components/candidates/CandidateRow` |
| `modals/recruitment/ApplicantDetailsModal.jsx` | `recruitment/utils/candidates` |
| `navigation/.../MobileBottomNav.jsx` | `feed/hooks/useFeedActions` |
| `data-display/ProfileHero`, `ProfilePageContent` | `data/dashboard` (`currentUser`) |
| `data-display/BlogCard/BlogCategoryBadge`, `ListingCard` | `data/blogs`, `data/marketplace` |
| `data-display/ActivitySection` | `feed` (index; fine) |

There are no import cycles today. One loop exists through files rather than
through index imports: `feed/index.js` re-exports `CreatePostModal`, and
`CreatePostModal` imports feed internals.

**Recommendation:** treat the feed and recruitment modals as part of their
features. Either move them back under `feed/components/modals/` and
`recruitment/components/modals/`, or expose what they need through
`feed/index.js` and `recruitment/index.js` and import only from there. Also,
`layouts/UserLayout.jsx` and `MobileBottomNav` use the feed actions context,
which is app-level state; it fits better in `shared/context`.

### 3.3 Imports that bypass a feature's `index.js` (low)

Each feature doc says "code outside this folder must import from `index.js`
only". Apart from the cases in 3.2, two more break that rule:

- `profile/pages/ProfileView.jsx` → `feed/hooks/usePostEditor` (export it from
  `feed/index.js`)
- `layouts/UserLayout.jsx` → `feed/context/FeedActionsContext`

Route files lazy-import `*/pages/*View` directly. That is intentional, for
code splitting, and documented.

Inside the module, only two features depend on another feature, both through
its index: `contacts` and `profile` use `feed`, and `profile` uses
`subscription`. Supplier and admin pages reuse `feed`, `general`,
`recruitment` and `profile` through their indexes, which is correct.

### 3.4 Layout inconsistencies (low)

- `feed/constants.js` sits at the feature root; every other feature uses
  `constant/constants.js`. It is imported by `CreatePostModal` and
  `SharePostModal` as `feed/constants`.
- `feed/context/` exists only in feed. The provider is app-wide, so see 3.2.
- `messages` is a 5-line wrapper around `@/modules/messages/route/ChatLayout`,
  with no `index.js`, doc or test. That is acceptable for a thin route
  wrapper, but it could live in `modules/messages` itself.
- `feed/doc/PROMPT.md` is the only prompt file kept in a feature doc folder.
- The "line counts" tables in several `doc/STRUCTURE.md` files record sizes
  from a past refactor and no longer match the code.

### 3.5 Tests (informational)

- `npx vitest run src/modules/dash/user`: **39 files, 277 tests, all passed.**
- Tests cover utils and views well. **No hook has a test of its own**: all 51
  hooks lack a matching test file. They are exercised only indirectly through
  view tests (static rendering, with no DOM environment). The
  highest-value hooks to test are `feed/hooks/usePostDraft`,
  `marketplace/hooks/useListingForm`, `recruitment/hooks/useJobForm` and
  `contacts/hooks/useContactsDirectory`. That needs `jsdom` and
  `@testing-library/react`, which are not installed.
- Utils without a direct test: `feed/utils/{authorProfileHref,formatBytes,postPayload,postTypeOptions}`.
- `messages` and `data` have no tests.

### 3.6 Lint (informational)

`npx eslint src/modules/dash/user` reports **0 problems**.

## 4. Recommended order of work

| # | Task | Risk | Size |
| - | ---- | ---- | ---- |
| 1 | Remove the `currentUser` fallbacks in `listingSeller` and the `ProfileHero` / `ProfilePageContent` defaults | Low, visible fix | S |
| 2 | Move real option lists from `data/` into the owning `constant/` files; move `formatPrice` to `shared/utils` | Low, import moves | M |
| 3 | Delete the unused demo exports and `productImages.js` (after step 2) | Low | S |
| 4 | Put the feed and recruitment modals back inside their features, or route them through `index.js` | Medium, many imports | M |
| 5 | Move `FeedActionsContext` and `useFeedActions` to `shared/context`; export `usePostEditor` from `feed/index.js` | Low | S |
| 6 | Rename `feed/constants.js` to `feed/constant/constants.js` | Low | S |
| 7 | Split `JobPostForm.jsx`: move `Field`, `FormSection` and the workplace radio group into `components/form/` | Low | S |
| 8 | Add `jsdom` and Testing Library; test the four form and draft hooks | None at runtime | M |
| 9 | Refresh the stale line-count tables in the feature docs | None | S |
