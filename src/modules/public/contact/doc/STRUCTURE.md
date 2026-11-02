# Public contact — structure

The public `/contact` page, rendered inside `layouts/RootLayout` and linked from
the footer (`AppFooter`). Visitors fill in a form that is sent to
`POST /contact`; the server emails it to the contact inbox
(`CONTACT_INBOX_EMAIL`, default `info@labunity.be`) with the sender as reply-to.
Account and suspension help stays on `/contact-support`
(`shared/constants/support.js`).

## Folder layout

```
contact/
├── pages/
│   └── ContactView.jsx        Heading, form card, contact email line
├── components/
│   └── ContactForm.jsx        Fields, submit button, "Message sent" state
├── hooks/
│   └── useContactForm.js      Form values, validation, sending
├── utils/
│   └── contactForm.js         Request body and client-side validation
├── index.js                   Public API: CONTACT_PATH, CONTACT_EMAIL
├── constant/
│   └── constants.js           Path, email, inquiry types, empty form, message limits
├── test/
│   └── contactForm.test.js
└── doc/
    └── STRUCTURE.md
```

API helper: `features/public/contact/contactApi.js`.

## Rules

- Inquiry type values and field limits mirror the server's
  `modules/contact/contact.validators.ts`; change both together.
