# Public pricing — structure

The public `/pricing` page, rendered inside `layouts/RootLayout` and linked from
the homepage CTA. It shows the same plan card as the member subscription page
(billing-cycle toggle, price panel, "Everything included" list) using the
components from `modules/dash/user/subscription`, with plans from the public
`GET /subscriptions/plans` endpoint. It has no account state and never starts
checkout.

## Folder layout

```
pricing/
├── pages/
│   └── PricingView.jsx        Header, cycle toggle, plan card; loading and retry states
├── index.js                   Public API: PRICING_PATH
├── constant/
│   └── constants.js           PRICING_PATH, JOIN_PATH
├── hooks/
│   └── usePublicPricing.js    Loads plans, billing cycle, plan button action
├── utils/
│   └── pricingAction.js       Guest → /join, member → /subscription, others → dashboard
├── test/
│   └── pricingAction.test.js
└── doc/
    └── STRUCTURE.md
```

## Rules

- Checkout only happens on `/subscription` for signed-in members; this page
  links there instead of calling the subscribe API.
