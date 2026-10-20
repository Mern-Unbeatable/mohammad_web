# Router structure

The app router (`createBrowserRouter`) plus the small routing helpers the
routes, layouts and auth pages rely on.

```
shared/router/
├── index.jsx                   # builds `router` from every route group; imported by App.jsx
├── routes/                     # role-scoped route definitions
│   ├── public.routes.jsx       # home, legal pages, NotFound
│   ├── auth.routes.jsx         # GuestOnly + login / register / forgot / reset / support
│   ├── user.routes.jsx         # RequireRole(USER) + UserLayout
│   ├── supplier.routes.jsx     # RequireRole(SUPPLIER) + SupplierLayout
│   ├── admin.routes.jsx        # RequireRole(ADMIN) + AdminLayout
│   └── chat.routes.jsx         # buildChatRoute / legacyChatRoute, shared by the role routes
├── guards/                     # route elements used by routes/*.routes.jsx
│   ├── index.js                # RequireRole, GuestOnly, SessionCheckingFallback (re-export)
│   ├── RequireRole.jsx         # login redirect, wrong-role redirect (handle.roleRedirect)
│   └── GuestOnly.jsx           # sends signed-in users to their home path
├── utils/
│   ├── lazyPage.jsx            # React.lazy + Suspense wrapper used by the role routes
│   └── safeRedirect.js         # getSafeRedirectPath for login / register `?redirect=`
├── test/
└── doc/STRUCTURE.md
```

Guards import `useAuth` from `@/modules/auth`. Loading UI (`PageLoadingFallback`,
`SessionCheckingFallback`) lives in `@/components/loader/fallbacks`. Route
layouts live in `@/layouts`. The root `errorElement` is
`@/modules/error/RouterErrorPage`; `ScrollToTop` (rendered by the layouts and
`PanelLayout`) is `@/components/common/scrolls/ScrollToTop`.
