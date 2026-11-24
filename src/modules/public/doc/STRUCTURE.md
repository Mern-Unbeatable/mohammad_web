# Public module — structure

Pages anyone can open without signing in, rendered inside
`layouts/RootLayout` (public navbar from `@/components/navigation`, plus
`AppFooter`). Same layout as `modules/dash/*`: one folder per feature, each
with `pages/`, `components/`, `hooks/`, `constant/`, `test/`, `doc/` and an
`index.js`.

## Folder layout

```
public/
├── home/                    Landing page (/); see home/doc/STRUCTURE.md
│   ├── pages/        HomeView
│   ├── components/   sections/ (HeroSection, FeaturesSection, EcosystemSection, CtaSection), DiscoverTag
│   ├── hooks/        useHomeCta
│   ├── utils/        scrollToSection
│   ├── constant/ test/ doc/
│   └── index.js             Public API: HOME_PATH, HOME_SECTIONS
│
├── legal/                   Terms (/terms) and Privacy (/privacy); see legal/doc/STRUCTURE.md
│   ├── pages/        TermsOfServiceView, PrivacyPolicyView
│   ├── content/      termsOfService, privacyPolicy (section text)
│   ├── components/   LegalDocument, LegalHeader, LegalToc, LegalArticle, LegalFooterLinks
│   ├── hooks/        useActiveSection
│   ├── constant/ test/ doc/
│   └── index.js             Public API: TERMS_PATH, PRIVACY_PATH, LEGAL_LAST_UPDATED
│
└── doc/STRUCTURE.md
```

## Imports

- `shared/router/routes/public.routes.jsx` imports the pages by file path
  (`@/modules/public/<feature>/pages/<View>`).
- Everything else goes through a feature's `index.js`
  (e.g. `AppFooter` and `RegisterView` use `@/modules/public/legal`).
- The navbar is not part of this module: it is `PublicNavbar` in
  `@/components/navigation`, next to the other navigation chrome.
