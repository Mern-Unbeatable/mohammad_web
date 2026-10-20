# Admin profile — structure

The admin's own account page (`/admin/profile`): avatar upload, name / email
update and password change. Data comes from `@/features/dash/admin/profile`
(`state.adminProfile`).

## Folder layout

```
profile/
├── pages/
│   └── AdminProfileView.jsx          Skeleton while loading, otherwise AdminAccountForm
│
├── index.js                          Public API: PROFILE_PATH
│
├── constant/
│   └── constants.js                  Path, empty passwords, image types, default initials, toast messages
│
├── components/form/
│   ├── AdminAccountForm.jsx          Header + card with the three parts below
│   ├── ProfileSummary.jsx            AvatarPicker, display name / email, upload hint
│   ├── AvatarPicker.jsx              Avatar button with hidden file input and upload overlay
│   ├── AccountInfoSection.jsx        Name / email + Update Profile
│   └── PasswordSection.jsx           Current / new / confirm + Change Password
│
├── hooks/
│   └── useAdminProfile.js            Load, error toasts, field changes, profile / avatar / password submit
│
├── utils/
│   └── profileForm.js                avatarFileError, passwordError, toPasswordPayload
│
├── test/
│   ├── profileForm.test.js
│   └── ProfileViews.test.jsx
│
└── doc/
    └── STRUCTURE.md
```

## Rules

- Pages only wire hooks to components; components never dispatch.
- Hooks own Redux access and toasts; utils are pure.
- While a save is running, the matching submit handler only prevents the
  default, as before.
