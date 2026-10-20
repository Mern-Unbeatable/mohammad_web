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
├── components/
│   ├── RouterErrorPage.jsx     # root errorElement
│   ├── PageLoadingFallback.jsx # Suspense fallback for lazy pages (also ChatRedirect)
│   └── ScrollToTop.jsx         # rendered by the layouts and PanelLayout
├── utils/
│   ├── lazyPage.jsx            # React.lazy + Suspense wrapper used by the role routes
│   └── safeRedirect.js         # getSafeRedirectPath for login / register `?redirect=`
├── test/
└── doc/STRUCTURE.md
```

Route guards live in `@/shared/guards`; route layouts in `@/layouts`.
