# Public legal — structure

The Terms of Service (`/terms`) and Privacy Policy (`/privacy`) pages,
rendered inside `layouts/RootLayout`. Both use one `LegalDocument` frame: a
header with the last-updated date, a sticky "On this page" list that follows
the scroll position, numbered sections, and links to the other page and to
support.

## Folder layout

```
legal/
├── pages/
│   ├── TermsOfServiceView.jsx        LegalDocument + terms content
│   └── PrivacyPolicyView.jsx         LegalDocument + privacy content
│
├── index.js                          Public API: TERMS_PATH, PRIVACY_PATH, LEGAL_LAST_UPDATED
│
├── constant/
│   └── constants.js                  Paths, last-updated date, observer margin, section body class
│
├── content/
│   ├── termsOfService.jsx            TERMS_OF_SERVICE (title, intro, related) + TERMS_SECTIONS
│   └── privacyPolicy.jsx             PRIVACY_POLICY (title, intro, related) + PRIVACY_SECTIONS
│
├── components/
│   ├── LegalDocument.jsx             Frame: header, TOC, article, footer links
│   ├── LegalHeader.jsx
│   ├── LegalToc.jsx                  "On this page" with the active section highlighted
│   ├── LegalArticle.jsx              Numbered `<section id>` blocks
│   └── LegalFooterLinks.jsx          "Also read" + support email
│
├── hooks/
│   └── useActiveSection.js           IntersectionObserver → active section id
│
├── test/
│   └── LegalViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Legal text lives in `content/`; each section is `{ id, heading, content }`
  and `id` is its anchor, so ids must stay unique and stable.
- When the text changes, update `LEGAL_LAST_UPDATED`.
- Other modules import the paths from `@/modules/public/legal`
  (`AppFooter`, `RegisterView`, `public.routes`).
