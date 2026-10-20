# Admin marketplace — structure

Marketplace moderation for admins: the listing grid (`/admin/marketplace`)
with category pills, paging and delete; and the listing detail
(`/admin/marketplace/:listingId`) with gallery, specs, price, seller and a
Contact seller conversation. Data comes from
`@/features/dash/admin/marketplace` (`state.adminMarketplace`).

## Folder layout

```
marketplace/
├── pages/
│   ├── AdminMarketplaceView.jsx          Header, CategoryFilter, error banner, ListingsGrid, pagination, delete modal
│   └── AdminListingDetailView.jsx        Skeleton / NotFound, gallery + info, price + seller, StartConversationModal
│
├── index.js                              Public API: MARKETPLACE_PATH, listingDetailPath
│
├── constant/
│   └── constants.js                      Paths (incl. seller profile), page size, default category, grid class
│
├── components/
│   ├── list/
│   │   ├── CategoryFilter.jsx            Category pills
│   │   ├── ListingsGrid.jsx              Skeletons, empty message or ListingCard grid
│   │   └── DeleteListingModal.jsx        ConfirmModal with the delete wording
│   ├── detail/
│   │   ├── ListingGallery.jsx            Main image + thumbnails (own selection state)
│   │   ├── ListingInfoCard.jsx           Badges, title, description, spec tiles
│   │   ├── PriceCard.jsx                 Price, Contact seller, verified note
│   │   └── SellerCard.jsx                Seller summary + link to the admin user page
│   └── common/
│       └── ErrorBanner.jsx
│
├── hooks/
│   ├── useAdminListings.js               Category, paging, fetch, card models, delete flow + toasts
│   └── useAdminListingDetail.js          Fetch by id, clear on leave, contact modal + startConversation
│
├── utils/
│   └── listings.js                       buildListingsQuery, listingImages, canContactSeller
│
├── test/
│   ├── listings.test.js
│   └── MarketplaceViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access, auth and toasts; utils are pure.
- Mappers come from the `@/features/dash/admin/marketplace` index, not from
  `marketplaceMappers` directly.

## Notes

- Changing the category resets the page in its handler instead of in a
  separate effect.
- The selected gallery image used to be reset by an effect on the listing id.
  `ListingGallery` now owns that state and is rendered with
  `key={listing.id}`, so it starts at the first image for each listing. Both
  changes remove `react-hooks/set-state-in-effect` lint errors.
