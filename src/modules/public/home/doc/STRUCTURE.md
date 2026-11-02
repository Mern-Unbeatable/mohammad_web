# Public home — structure

The marketing landing page at `/`, rendered inside `layouts/RootLayout`
(public navbar + footer). Four sections; the first three have anchors that
the public navbar links to as `/#platform`, `/#community`, `/#marketplace`.

## Folder layout

```
home/
├── pages/
│   └── HomeView.jsx                  Hero, Features, Ecosystem, CTA
│
├── index.js                          Public API: HOME_PATH, HOME_SECTIONS
│
├── constant/
│   └── constants.js                  Paths, section ids, hero bullets, discover tags,
│                                     avatars, network nodes / stats, marketplace items, knowledge tags
│
├── components/
│   ├── sections/
│   │   ├── HeroSection.jsx           #platform: headline, CTA, "Explore Network", hero image
│   │   ├── FeaturesSection.jsx       #community: feature cards
│   │   ├── EcosystemSection.jsx      #marketplace: network graph, marketplace / jobs / knowledge / messaging
│   │   └── CtaSection.jsx            Closing call to action
│   └── DiscoverTag.jsx               Icon pill in "Discover More Than Connections"
│
├── hooks/
│   └── useHomeCta.js                 Signed-in user → their home ("Dashboard"), else /join
│
├── utils/
│   └── scrollToSection.js            Smooth in-page scroll + hash for "Explore Network"
│
├── test/
│   ├── HomeView.test.jsx
│   └── scrollToSection.test.js
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Sections render only; auth state comes from `useHomeCta`.
- Copy and demo data live in `constant/constants.js`; Tailwind class strings
  used by a single section stay in that section.
- Animations come from `@/shared/motion/LandingMotion`.
