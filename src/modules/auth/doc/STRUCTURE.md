# Shared auth structure

App-wide session and access control on top of the `auth` Redux slice
(`@/features/auth`). Import from `@/shared/auth`.

```
shared/auth/
├── index.js                      # public API (see below)
├── hooks/
│   └── useAuth.js                # user, role, homePath + login / register / logout / password actions
├── guards/                       # route elements for store/router/*.routes.jsx
│   ├── RequireRole.jsx           # login redirect, wrong-role redirect (handle.roleRedirect)
│   ├── GuestOnly.jsx             # sends signed-in users to their home path
│   └── SessionCheckingFallback.jsx
├── session/
│   └── AuthSessionBridge.jsx     # boot: revalidates the token via /auth/me, shows boot screen
├── utils/
│   └── accountIdentity.js        # pure: user → { name, initials, avatar }
├── test/
└── doc/STRUCTURE.md
```

## Public API (`@/shared/auth`)

| Export | Used by |
|---|---|
| `AuthSessionBridge` | `main.jsx` (wraps the app) |
| `RequireRole` | `store/router/{user,supplier,admin}.routes.jsx` |
| `GuestOnly` | `store/router/auth.routes.jsx` |
| `useAuth` | auth pages, public navbar / home, panels, navigation, messenger, role pages |
| `toAccountIdentity` | `PanelLayout`; `features/dash/admin/profile/profileMappers.js` imports `utils/accountIdentity` directly so the feature layer does not load React components |
