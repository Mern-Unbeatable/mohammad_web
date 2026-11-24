# Supplier payments — structure

The supplier billing page (`/supplier/payments`): KPI cards for collected /
advertisement / membership totals, then a searchable filtered table of the
supplier's own Stripe invoices. Data comes from `GET /payments/me`
(`@/features/payments` + `@/components/payments`).

## Folder layout

```
payments/
├── pages/
│   └── SupplierPaymentsView.jsx   Header, KPI cards, DataTable
│
├── components/
│   └── paymentColumns.jsx         Type, description, date, invoice, amount, status, actions
│
├── hooks/
│   └── useSupplierPayments.js     Debounced search, kind/status filters, paging, invoice opener
│
├── constant/
│   └── constants.js               Page size, filter options
│
└── doc/
    └── STRUCTURE.md
```

## Notes

- Layout mirrors `/admin/payments` without the admin Sync / member columns.
- Summary KPIs are always scoped to the signed-in supplier (not the current filters).
