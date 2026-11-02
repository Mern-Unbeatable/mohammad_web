# Auth module structure

Everything auth-related in the UI: the guest pages (login, register, password
reset, support), app-wide session bootstrapping and the `useAuth` hook.
State and HTTP live in the Redux layer at `@/features/auth`; route guards
(`RequireRole`, `GuestOnly`) live in `@/shared/router/guards` and use `useAuth`.

```
modules/auth/
├── index.js                      # public API (see below); pages are not exported
├── login/                        # pages/LoginView, components/SuspensionNotice
├── register/                     # pages/RegisterView, components/SelectField, constant/
├── forgot-password/              # full feature layout; see forgot-password/doc/STRUCTURE.md
├── reset-password/               # full feature layout; see reset-password/doc/STRUCTURE.md
├── contact-support/              # full feature layout; see contact-support/doc/STRUCTURE.md
├── components/
│   ├── AuthFormFields.jsx        # PasswordField, PasswordStrength (built on @/components/form-controls, variant "auth")
│   ├── BackToSignIn.jsx          # "← Back to Sign In" link (forgot-password, reset-password, contact-support)
│   └── AuthSessionBridge.jsx     # boot: revalidates the token via /auth/me, shows boot screen
├── test/
└── doc/STRUCTURE.md
```

Each page is imported directly by `shared/router/routes/auth.routes.jsx`
(`@/modules/auth/<feature>/pages/<View>`). `useAuth` lives in
`@/shared/hooks/useAuth`; `accountIdentity` and `passwordRules` live in
`@/shared/utils/auth/`.

## Public API (`@/modules/auth`)

| Export | Used by |
|---|---|
| `AuthSessionBridge` | `main.jsx` (wraps the app) |
| `useAuth` | `shared/router/guards`, public navbar / home, panels, navigation, messenger, role pages |
| `toAccountIdentity` | `PanelLayout` |

## Rules

- Files inside this module import each other relatively (e.g. pages use
  `../hooks/useAuth`), never through `@/modules/auth`, to avoid import cycles.
- `features/dash/admin/profile/profileMappers.js` imports
  `@/modules/auth/utils/accountIdentity` directly so the Redux layer does not
  load React components.
