# Loader structure

Every loading state in the app: the `Skeleton` primitive, one file per
skeleton, the `CardSkeleton` variant renderer, route / session fallbacks,
the app boot screen and page spinners.

```
components/loader/
├── index.js                    # public API: every loader by name (+ default Skeleton)
├── common/
│   ├── Skeleton.jsx            # base pulse block: <Skeleton className rounded tone>
│   └── CardSkeleton.jsx        # <CardSkeleton variant count as itemClassName> + CARD_SKELETONS
├── test/CardSkeleton.test.jsx
├── primitives/                 # reusable shapes built from Skeleton
│   ├── SkeletonText.jsx        # paragraph: <SkeletonText widths={['w-full', 'w-3/4']} className />
│   └── SkeletonField.jsx       # form field: <SkeletonField labelWidth inputClassName />
├── skeletons/
│   ├── cards/                  # one card each: ContactCardSkeleton, JobCardSkeleton, StatCardSkeleton, …
│   ├── rows/                   # list rows: NotificationRowSkeleton, SidebarJobRowSkeleton,
│   │                           # CandidateRowSkeleton, ConversationSkeleton, …
│   ├── charts/                 # LineChartCardSkeleton, BarChartCardSkeleton
│   └── pages/                  # whole pages: ProfilePageSkeleton, JobDetailPageSkeleton,
│                               # ListingDetailSkeleton, MessengerSkeleton, …
├── fallbacks/
│   ├── PageLoadingFallback.jsx     # Suspense fallback (lazyPage, ChatRedirect)
│   └── SessionCheckingFallback.jsx # route guards and NotFoundLayout while the session revalidates
├── screens/
│   └── AppBootLoadingScreen.jsx    # AuthSessionBridge before the first render
├── spinners/
│   ├── LoadingCard.jsx             # generic spinner card: <LoadingCard label className>
│   ├── ListingFormLoading.jsx      # LoadingCard preset for the edit-listing form
│   └── ProfileSetupLoading.jsx     # LoadingCard preset for the edit-profile form
└── doc/STRUCTURE.md
```

## Building blocks

| Component | Props | Notes |
|---|---|---|
| `Skeleton` | `className`, `rounded` (`none`/`sm`/`md`/`lg`/`xl`/`full`), `tone` (`default`/`muted`) | Every skeleton is composed from this |
| `SkeletonText` | `widths` (full Tailwind classes), `className` (wrapper), `lineClassName` (default `h-3.5`) | Text paragraphs |
| `SkeletonField` | `labelWidth`, `inputClassName` (default `h-10 w-full`) | Label and input pairs in forms |
| `LoadingCard` | `label`, `className` (default `h-64`) | Spinner card |
| `SessionCheckingFallback` | `label` | Defaults to "Checking session…" |

Pass Tailwind classes as complete literal strings (`'w-3/4'`, not `` `w-${n}` ``)
so the JIT compiler can find them.

## Importing

- Skeletons: `import { CardSkeleton, JobDetailSkeleton } from '@/components/loader'`.
- Boot screen, fallbacks and spinners are imported by file path
  (`@/components/loader/fallbacks/PageLoadingFallback`, …) so the router and
  auth bootstrap do not pull every skeleton into the startup bundle.

## Adding a loader

| Loader | Put it in |
|---|---|
| Skeleton for a new card or row | `skeletons/cards/` or `skeletons/rows/`, add to `index.js`; add a variant to `CARD_SKELETONS` if it is rendered in lists |
| Whole-page skeleton | `skeletons/pages/`, compose existing card skeletons and primitives |
| A shape repeated across skeletons | `primitives/`, built on `Skeleton` |
| Spinner card | Use `<LoadingCard label="…" />`; add a preset in `spinners/` only if it is reused |
| Fallback | `fallbacks/` |
