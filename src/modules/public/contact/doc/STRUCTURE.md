# Public contact — structure

The public `/contact` page, rendered inside `layouts/RootLayout` and linked from
the footer (`AppFooter`). It shows the general enquiries address
(`CONTACT_EMAIL`). Account and suspension help stays on `/contact-support`
(`shared/constants/support.js`).

## Folder layout

```
contact/
├── pages/
│   └── ContactView.jsx        Heading and email card with a mailto button
├── index.js                   Public API: CONTACT_PATH, CONTACT_EMAIL
├── constant/
│   └── constants.js           CONTACT_PATH, CONTACT_EMAIL
└── doc/
    └── STRUCTURE.md
```
