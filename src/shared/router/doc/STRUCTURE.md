# Router structure

The app router (`createBrowserRouter`) plus the small routing helpers the
routes, layouts and auth pages rely on.

```
shared/router/
├── index.jsx                   # builds `router` from every route group; imported by App.jsx
├── routes/                     # role-scoped route definitions
│   ├── public.routes.jsx       # home, legal pages, NotFound
│   ├── auth.routes.jsx         # GuestOnly + login / register / reset / support
│   ├── user.routes.jsx         # RequireRole(USER) + UserLayout
│   ├── supplier.routes.jsx     # RequireRole(SUPPLIER) + SupplierLayout
│   ├── admin.routes.jsx        # RequireRole(ADMIN) + AdminLayout
│   └── chat.routes.jsx         # buildChatRoute / legacyChatRoute, shared by the role routes
├── guards/                     # route elements used by routes/*.routes.jsx
<<<<<<< HEAD
│   ├── index.js                # RequireRole, GuestOnly, SessionCheckingFallback (re-export)
│   ├── RequireRole.jsx         # login redirect, wrong-role redirect (handle.roleRedirect)
│   └── GuestOnly.jsx           # sends signed-in users to their home path
=======
│   ├── index.js                # RequireRole, GuestOnly, SessionCheckingFallback
│   ├── RequireRole.jsx         # login redirect, wrong-role redirect (handle.roleRedirect)
│   ├── GuestOnly.jsx           # sends signed-in users to their home path
│   └── SessionCheckingFallback.jsx
>>>>>>> 83ebffb0c717a2f6754699937caf77e8fce8f0e3
├── components/
│   ├── RouterErrorPage.jsx     # root errorElement
│   └── ScrollToTop.jsx         # rendered by the layouts and PanelLayout
├── utils/
│   ├── lazyPage.jsx            # React.lazy + Suspense wrapper used by the role routes
│   └── safeRedirect.js         # getSafeRedirectPath for login / register `?redirect=`
├── test/
└── doc/STRUCTURE.md
```

<<<<<<< HEAD
Guards import `useAuth` from `@/modules/auth`. Loading UI (`PageLoadingFallback`,
`SessionCheckingFallback`) lives in `@/components/loader/fallbacks`. Route layouts live in `@/layouts`.
=======
Guards import `useAuth` from `@/modules/auth`. Route layouts live in `@/layouts`.
>>>>>>> 83ebffb0c717a2f6754699937caf77e8fce8f0e3
