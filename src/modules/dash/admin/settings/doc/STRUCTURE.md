# Admin settings — structure

Platform settings (`/admin/settings`): subscription prices, sponsored-post
tier prices and the marketplace / general category lists, each saved on its
own. Data comes from `@/features/dash/admin/settings` (`state.adminSettings`).

## Folder layout

```
settings/
├── pages/
│   └── AdminSettingsView.jsx         Header + skeleton / retry card, or SettingsEditor (keyed per load) with the four sections
│
├── index.js                          Public API: SETTINGS_PATH
│
├── constant/
│   └── constants.js                  Path, page title / subtitle, toast messages
│
├── components/
│   ├── sections/
│   │   ├── SubscriptionSection.jsx   Monthly / yearly prices, Save, included features
│   │   ├── SponsoredSection.jsx      One row per tier (day + price + Save)
│   │   └── CategorySection.jsx       Save categories, add input, removable tags (used twice)
│   └── common/
│       ├── SectionHeader.jsx         Icon tile + title + subtitle
│       ├── PriceField.jsx            Decimal input with € suffix
│       └── SettingsLoadError.jsx     Message + Retry
│
├── hooks/
│   ├── useAdminSettings.js           Load / reload, save error toasts → { status, settings, formKey }
│   └── useSettingsForm.js            Editable copy of the settings and the four saves + toasts
│
├── utils/
│   └── settingsForm.js               priceText, parsePrice, toTierForm, toTierPayload, addUniqueCategory, saveLabel
│
├── test/
│   ├── settingsForm.test.js
│   └── SettingsViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Hooks own Redux access and toasts; utils are pure; section components
  never dispatch.
- The form state is seeded once from the loaded settings. `SettingsEditor`
  (in the page file) is rendered with `key={loadedRequestId}`, so a reload
  resets the form without a syncing effect.
