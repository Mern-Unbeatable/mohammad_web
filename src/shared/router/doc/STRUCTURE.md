# Router structure

The app router (`createBrowserRouter`) plus the small routing helpers the
routes, layouts and auth pages rely on.

```
shared/router/
├── index.jsx                   # createBrowserRouter(appRoutes); imported by App.jsx
├── routes/                     # role-scoped route definitions
│   ├── app.routes.jsx          # AppRootLayout + errorElement wrapping every group below
│   ├── public.routes.jsx       # RootLayout: home, legal pages
│   ├── auth.routes.jsx         # GuestOnly > one AuthLayout > login / join / forgot / reset;
│   │                           # contact support in its own AuthLayout, outside GuestOnly
│   ├── user.routes.jsx         # RequireRole(USER) + UserLayout
│   ├── supplier.routes.jsx     # RequireRole(SUPPLIER) + SupplierLayout (in-panel `*` 404)
│   ├── admin.routes.jsx        # RequireRole(ADMIN) + AdminLayout (in-panel `*` 404)
│   ├── chat.routes.jsx         # buildChatRoute / legacyChatRoute, shared by the role routes
│   └── notFound.routes.jsx     # root `*` → NotFoundLayout (lowest-ranked match)
├── guards/                     # route elements used by routes/*.routes.jsx
│   ├── index.js                # RequireRole, GuestOnly
│   ├── RequireRole.jsx         # login redirect, wrong-role redirect (handle.roleRedirect)
│   └── GuestOnly.jsx           # sends signed-in users to their home path
├── utils/
│   ├── lazyPage.jsx            # React.lazy + Suspense wrapper used by the role routes
│   └── safeRedirect.js         # getSafeRedirectPath for login / register `?redirect=`
├── test/                       # app, public and chat route matching
└── doc/STRUCTURE.md
```

Guards import `useAuth` from `@/modules/auth`. Loading UI (`PageLoadingFallback`,
`SessionCheckingFallback`) lives in `@/components/loader/fallbacks`. Route
layouts live in `@/layouts`. The root `errorElement` is
`@/modules/error/RouterErrorPage`. `ScrollToTop`
(`@/components/common/scrolls/ScrollToTop`) is mounted once, in
`layouts/AppRootLayout`.

`NotFoundLayout` picks the 404 shell from the session: signed-in USER members
get `UserLayout` + `PanelNotFound`; guests, and supplier / admin users at
unknown root URLs, get `RootLayout` + `NotFound`. Unknown URLs under
`/supplier` and `/admin` are caught by the panel `*` routes first.
