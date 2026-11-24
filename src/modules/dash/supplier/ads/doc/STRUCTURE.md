# Supplier ads — structure

The supplier's own advertisements: the list (`/supplier/ads`) with KPI cards,
search, status filter, paging, and create / resubmit / renew; and the detail
page (`/supplier/ads/:adId`) with a split preview + status sidebar (mirrors
admin detail layout, with supplier manage actions). Data comes from
`@/features/dash/supplier/advertisements`.

## Folder layout

```
ads/
├── pages/
│   ├── SupplierAdsView.jsx        Header + create button, KPI cards, AdsTable, CreateAdModal
│   └── SupplierAdDetailView.jsx   Back, preview card, status sidebar, CreateAdModal
│
├── index.js                       Public API: AdDetailCard (CreateAdModal preview), AdCell, ADS_PATH, adDetailPath
│
├── constant/
│   └── constants.js               Paths, page size, status labels/pills, filter options, default rejection text
│
├── components/
│   ├── list/
│   │   ├── AdsTable.jsx           DataTable with search, status filter, columns, row actions, pagination
│   │   └── AdCell.jsx             Title + category icon and pill
│   ├── detail/
│   │   ├── AdHeader.jsx           Company + category + Sponsored
│   │   ├── AdBody.jsx             Title, description, image, price
│   │   ├── AdStatusSidebar.jsx    Status, metrics, rejection, manage actions
│   │   ├── AdManageActions.jsx    Pay / cancel / resubmit / renew / delete
│   │   ├── AdDetailCard.jsx       CreateAdModal preview card
│   │   ├── RejectionNotice.jsx
│   │   ├── BackToAdsLink.jsx
│   │   └── AdComments.jsx
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useSupplierAds.js          List filters, paging, row actions, create modal
│   ├── useSupplierAdDetail.js     Detail fetch + manage actions + create modal
│   └── useAdEngagement.js         In-memory reactions/comments (preview helpers)
│
├── utils/
│   ├── adsQuery.js
│   ├── adRowActions.js
│   ├── adManageActions.js
│   └── localComments.js
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

- List and detail layouts mirror `/admin/advertisement`; suppliers keep create /
  pay / cancel / resubmit / renew / delete instead of admin review actions.
- `AdDetailCard` remains for CreateAdModal preview (`showSocial={false}`).
