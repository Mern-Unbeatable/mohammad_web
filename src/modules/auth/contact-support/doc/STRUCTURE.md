# Auth contact-support — structure

The `/contact-support` page. Opened from the login page, either for general
help or — when sign-in was refused because the account is suspended — with
history state `{ suspended, email, reason }`. It shows the support address
(with copy), what to include, and an "Email support" button with a prefilled
`mailto:` (an appeal when suspended).

## Folder layout

```
contact-support/
├── pages/
│   └── ContactSupportView.jsx        Heading, sections below, Email support, BackToSignIn (from auth/components)
│
├── constant/
│   └── constants.js                  Copy toast texts + reset delay, subtitles, checklist items, mail subjects
│
├── components/
│   ├── SuspensionDetails.jsx         Red box: account + reason (suspension only)
│   ├── SupportEmailCard.jsx          Support address link + copy button
│   └── SupportChecklist.jsx          "Please include in your message"
│
├── hooks/
│   └── useContactSupport.js          History state, subtitle, mailto, copy + toasts
│
├── utils/
│   └── supportMail.js                readSupportState, buildMailto
│
├── test/
│   ├── supportMail.test.js
│   └── ContactSupportView.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- The page only wires the hook to components; components hold no state.
- The hook owns the clipboard and toasts; utils are pure.
- The support address comes from `@/shared/constants/support`.
