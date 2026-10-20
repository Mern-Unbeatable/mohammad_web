# Supplier ads — structure

The supplier's own advertisements: the list (`/supplier/ads`) with search,
status and sort filters, paging, and create / resubmit / renew; and the detail
page (`/supplier/ads/:adId`) with the ad preview, rejection reason, reactions
and comments. Data comes from `@/features/dash/supplier/advertisements`.

## Folder layout

```
ads/
├── pages/
│   ├── SupplierAdsView.jsx        Header + create button, AdsTable, CreateAdModal
│   └── SupplierAdDetailView.jsx   Loading / not found, back link, rejection notice, card, comments
│
├── index.js                       Public API: AdDetailCard (CreateAdModal preview), AdCell, ADS_PATH, adDetailPath (dashboard)
│
├── constant/
│   └── constants.js               Paths, page size, debounce delay, status labels, filter / sort options, default rejection text
│
├── components/
│   ├── list/
│   │   ├── AdsTable.jsx           DataTable with search, filters, columns, row actions, pagination
│   │   └── AdCell.jsx             Title + category pill
│   └── detail/
│       ├── AdDetailCard.jsx       Company, title, description, image, dates, price, reactions bar
│       ├── RejectionNotice.jsx    Red notice with the reason (or the default text)
│       ├── BackToAdsLink.jsx
│       └── AdComments.jsx         Framed PostComments
│                              (CreateAdModal: @/components/modals/supplier)
│
├── hooks/
│   ├── useSupplierAds.js          Filters, debounced search, paging, fetch, row actions, create / resubmit modal
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

- Comments and reactions on the detail page are kept in memory and are lost
  on reload; there is no ads comments API yet.
- The search debounce now resets the page inside the timer instead of in a
  separate effect. The reset happens at the same moment as before, and the
  `react-hooks/set-state-in-effect` lint error is gone.
