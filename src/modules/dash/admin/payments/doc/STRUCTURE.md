# Payments module (admin) — structure report

The admin billing page (`/admin/payments`): every member's and supplier's
Stripe payments, paid totals, filters, invoice / PDF / receipt links, and a
"Sync from Stripe" backfill.

## Folder layout

```
payments/
├── pages/
│   └── AdminPaymentsView.jsx   Page: header + sync button, paid-total stat cards, DataTable
├── components/
│   └── paymentColumns.jsx      Table columns (member links to the user detail page)
├── hooks/
│   └── useAdminPayments.js     Debounced search, type / status filters, paging, sync action
├── constant/
│   └── constants.js            Page size, filter options, messages
└── doc/
    └── STRUCTURE.md
```

## Shared pieces it builds on

| Piece | Where | Also used by |
| ----- | ----- | ------------ |
| `paymentsApi`, `toPaymentModel`, `formatMoney` | `@/features/payments` | every payment view |
| `usePaymentHistory`, `useInvoiceOpener` | `@/components/payments` | every payment view |
| `PaymentHistoryCard` | `@/components/payments` | user `/subscription` (billing history), supplier `/supplier/payments`, admin user detail sidebar |
| `InvoiceButtons`, `PaymentStatusBadge` | `@/components/payments` | this table and the card |

## How it works

- Data comes from `GET /admin/payments` (`kind`, `status`, `search`, `userId`,
  `page`, `pageSize`); `meta.summary` holds EUR paid totals for the current
  filters.
- Invoice buttons call `GET /payments/:id/links` on click, which re-reads the
  links from Stripe because Stripe-hosted links can expire.
- "Sync from Stripe" calls `POST /admin/payments/sync`: it imports every Stripe
  invoice plus paid ads that predate invoicing. Run it once after deploying.
