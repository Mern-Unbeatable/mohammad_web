# Auth module structure

Everything auth-related in the UI: the guest pages (login, register, password
reset, support), app-wide session bootstrapping, route guards and the
`useAuth` hook. State and HTTP live in the Redux layer at `@/features/auth`.

```
modules/auth/
├── index.js                      # public API (see below); pages are not exported
├── pages/                        # imported directly by shared/router/auth.routes.jsx
│   ├── LoginView.jsx
│   ├── RegisterView.jsx
│   ├── ForgotPasswordView.jsx
│   ├── ResetPasswordView.jsx
│   └── ContactSupportView.jsx
├── components/
│   └── AuthFormFields.jsx        # input / label classes, PasswordField, PasswordStrength
├── hooks/
│   └── useAuth.js                # user, role, homePath + login / register / logout / password actions
├── guards/                       # route elements for shared/router/*.routes.jsx
│   ├── RequireRole.jsx           # login redirect, wrong-role redirect (handle.roleRedirect)
│   ├── GuestOnly.jsx             # sends signed-in users to their home path
│   └── SessionCheckingFallback.jsx
├── session/
│   └── AuthSessionBridge.jsx     # boot: revalidates the token via /auth/me, shows boot screen
├── utils/                        # pure
│   ├── accountIdentity.js        # user → { name, initials, avatar }
│   └── passwordRules.js          # password strength checks
├── test/
└── doc/STRUCTURE.md
```

## Public API (`@/modules/auth`)

| Export | Used by |
|---|---|
| `AuthSessionBridge` | `main.jsx` (wraps the app) |
| `RequireRole` | `shared/router/{user,supplier,admin}.routes.jsx` |
| `GuestOnly` | `shared/router/auth.routes.jsx` |
| `useAuth` | public navbar / home, panels, navigation, messenger, role pages |
| `toAccountIdentity` | `PanelLayout` |

## Rules

- Files inside this module import each other relatively (e.g. pages use
  `../hooks/useAuth`), never through `@/modules/auth`, to avoid import cycles.
- `features/dash/admin/profile/profileMappers.js` imports
  `@/modules/auth/utils/accountIdentity` directly so the Redux layer does not
  load React components.
