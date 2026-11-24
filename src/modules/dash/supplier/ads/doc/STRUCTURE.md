# Supplier ads — structure

The supplier's own advertisements: the list (`/supplier/ads`) with KPI cards,
search, status filter, paging, and create / resubmit / renew; and the detail
page (`/supplier/ads/:adId`) with the ad preview, rejection reason, reactions
and comments. Data comes from `@/features/dash/supplier/advertisements`.

## Folder layout

```
ads/
├── pages/
│   ├── SupplierAdsView.jsx        Header + create button, KPI cards, AdsTable, CreateAdModal
│   └── SupplierAdDetailView.jsx   Loading / not found, back link, rejection notice, card, comments
│
├── index.js                       Public API: AdDetailCard (CreateAdModal preview), AdCell, ADS_PATH, adDetailPath (dashboard)
│
├── constant/
│   └── constants.js               Paths, page size, debounce delay, status labels, filter options, default rejection text
│
├── components/
│   ├── list/
│   │   ├── AdsTable.jsx           DataTable with search, status filter, columns, row actions, pagination
│   │   └── AdCell.jsx             Title + category icon and pill
│   └── detail/
│       ├── AdDetailCard.jsx       Company, title, description, image, dates, price, reactions bar
│       ├── RejectionNotice.jsx    Red notice with the reason (or the default text)
│       ├── BackToAdsLink.jsx
│       └── AdComments.jsx         Framed PostComments
│                              (CreateAdModal: @/components/modals/supplier)
│
├── hooks/
│   ├── useSupplierAds.js          Filters, debounced search, paging, fetch, summary, row actions, create / resubmit modal
│   ├── useSupplierAdDetail.js     Fetch by id → { status: loading | notFound | ready, ad }
│   └── useAdEngagement.js         Reaction, share flag and in-memory comments
│
├── utils/
│   ├── adsQuery.js                buildAdsQuery
│   ├── adRowActions.js            getAdRowActions (details; resubmit if rejected; renew if expired)
│   └── localComments.js           createLocalComment, toggleCommentLike
│
├── test/
│   ├── adsUtils.test.js
│   └── AdsComponents.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, toasts and navigation; utils are pure.
- Code outside `ads/` imports from `@/modules/dash/supplier/ads` only.

## Notes

- List layout mirrors `/admin/advertisement` (KPI cards + compact table); suppliers
  keep the create / pay / resubmit actions.
- Comments and reactions on the detail page are kept in memory and are lost
  on reload; there is no ads comments API yet.
