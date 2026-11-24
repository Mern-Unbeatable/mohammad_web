# Admin ads — structure

Advertisement review for admins: the list (`/admin/advertisement`) with
search, status filter, paging and row actions (details, Active, Expired,
Rejected with a reason); and the detail page (`/admin/advertisement/:adId`)
with the ad and Approve / Mark expired / Reject buttons. Data comes from
`@/features/dash/admin/advertisements` (`state.adminAds`).

## Folder layout

```
ads/
├── pages/
│   ├── AdminAdvertisementView.jsx        Header, error banner, AdsTable, reject modal
│   └── AdminAdvertisementDetailView.jsx  Error / loading, back button, ad card with review actions, reject modal
│
├── index.js                              Public API: ADS_PATH, adDetailPath
│
├── constant/
│   └── constants.js                      Paths, page size, debounce, status labels / pills, filter options, review buttons, messages
│
├── components/
│   ├── list/
│   │   ├── AdsTable.jsx                  DataTable with search, status filter, columns, row actions, pagination
│   │   └── AdCell.jsx                    Title + category pill
│   ├── detail/
│   │   ├── AdHeader.jsx                  Company, category, location, status pill
│   │   ├── AdBody.jsx                    Title, description, image, rejection reason, dates, price
│   │   ├── ReviewActions.jsx             Approve / Mark expired / Reject
│   │   └── AdLoadError.jsx
│   └── common/
│       ├── RejectAdModal.jsx             ReasonModal with the reject wording
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminAds.js                    Debounced search, status filter, paging, fetch, row actions, reject target
│   ├── useAdminAdDetail.js               Fetch by id → { status: loading | error | ready, ad }, review, reject modal
│   └── useAdReview.js                    Review by status label + toasts (shared by both pages)
│
├── utils/
│   ├── adsQuery.js                       buildAdsQuery
│   └── adRowActions.js                   getAdRowActions, rejectDescription
│
├── test/
│   ├── adsUtils.test.js
│   └── AdsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, toasts and navigation; utils are pure.
- Mappers come from the `@/features/dash/admin/advertisements` index, not
  from `adsMappers` directly.

## Notes

- The page reset after a search now happens inside the debounce timer, and
  only when the search text actually changed, instead of in a separate
  effect. Changing the status filter resets the page in its handler. This
  removes the `react-hooks/set-state-in-effect` lint error.
