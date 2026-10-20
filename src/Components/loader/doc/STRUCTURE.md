# Loader structure

Every loading state in the app: the `Skeleton` primitive, one file per
skeleton, the `CardSkeleton` variant renderer, route / session fallbacks,
the app boot screen and page spinners.

```
components/loader/
├── index.js                    # public API: every loader by name (+ default Skeleton)
├── Skeleton.jsx                # primitive pulse block; compose skeletons from it
├── CardSkeleton.jsx            # <CardSkeleton variant count as itemClassName> + CARD_SKELETONS
├── CardSkeleton.test.jsx
├── skeletons/
│   ├── cards/                  # one card each: ContactCardSkeleton, JobCardSkeleton, StatCardSkeleton, …
│   ├── rows/                   # list rows: NotificationRowSkeleton, SidebarJobRowSkeleton,
│   │                           # CandidateRowSkeleton, ConversationSkeleton, …
│   ├── charts/                 # LineChartCardSkeleton, BarChartCardSkeleton
│   └── pages/                  # whole pages: ProfilePageSkeleton, JobDetailPageSkeleton,
│                               # ListingDetailSkeleton, MessengerSkeleton, …
├── fallbacks/
│   ├── PageLoadingFallback.jsx     # Suspense fallback (lazyPage, ChatRedirect)
│   └── SessionCheckingFallback.jsx # route guards while the session revalidates
├── screens/
│   └── AppBootLoadingScreen.jsx    # AuthSessionBridge before the first render
├── spinners/
│   ├── ListingFormLoading.jsx      # edit-listing form
│   └── ProfileSetupLoading.jsx     # edit-profile form
└── doc/STRUCTURE.md
```

## Importing

- Skeletons: `import { CardSkeleton, JobDetailSkeleton } from '@/components/loader'`.
- Boot screen, fallbacks and spinners are imported by file path
  (`@/components/loader/fallbacks/PageLoadingFallback`, …) so the router and
  auth bootstrap do not pull every skeleton into the startup bundle.

## Adding a loader

| Loader | Put it in |
|---|---|
| Skeleton for a new card or row | `skeletons/cards/` or `skeletons/rows/`, add to `index.js`; add a variant to `CARD_SKELETONS` if it is rendered in lists |
| Whole-page skeleton | `skeletons/pages/`, compose existing card skeletons |
| Spinner / fallback | `spinners/` or `fallbacks/` |
