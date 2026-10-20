# Layouts structure

Route layouts used by `shared/router/*.routes.jsx`. The chrome they render
(navbar, sidebars, panel shell, footer) lives in `@/components/navigation`.

```
layouts/
├── RootLayout.jsx            # public site: NavbarLayout + <Outlet> + AppFooter
├── AuthLayout.jsx            # guest pages (login / register / reset)
├── UserLayout.jsx            # user dashboard: DashboardNavbar, MobileBottomNav, AppFooter
├── SupplierLayout.jsx        # PanelLayout + supplier nav and badges
├── AdminLayout.jsx           # PanelLayout + admin nav
└── doc/STRUCTURE.md
```

## Where things go

| Thing | Location |
|---|---|
| New role / route layout | `layouts/<Name>Layout.jsx`, wired in `shared/router/*.routes.jsx` |
| Panel shell and page frame pieces | `@/components/navigation/panel/` (`PanelLayout`, `PanelPage`, …) |
| Site footer | `@/components/navigation/footer/AppFooter` |
| Dashboard navbar / sidebars | `@/components/navigation` |
| Messenger route element | `@/modules/messages` (`route/ChatLayout`) |
