# Supplier profile — structure

The supplier profile editor (`/supplier/profile`): loads the profile, edits
fields, uploads avatar / cover images and saves. Data comes from
`@/features/dash/supplier/profile` (`state.supplierProfile`); the form itself
is the shared `ProfileSetupForm` from `@/modules/dash/user/profile`.

Unlike the user setup page, saving keeps the supplier on this page, and a
failed save is reported by the store's `saveError` toast.

## Folder layout

```
profile/
├── pages/
│   └── SupplierProfileView.jsx   Skeleton while loading, then ProfileSetupForm
│
├── index.js                      Public API: PROFILE_PATH (SupplierLayout, SupplierJobDetailView)
│
├── constant/
│   └── constants.js              Path, accepted image types, image field keys
│
├── hooks/
│   └── useSupplierProfile.js     Load, field changes, image upload, validation, save, error toasts
│
├── utils/
│   └── profileForm.js            countryOptions, isProfileImage, profileFormError, uploadSuccessMessage
│
├── test/
│   ├── profileForm.test.js
│   └── SupplierProfileView.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

There is no `components/` folder: the page renders only shared components.
