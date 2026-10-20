# Layouts structure

All app layouts: the route layouts used by `store/router/*.routes.jsx` and the
building blocks they (and panel pages) share.

```
layouts/
├── RootLayout.jsx            # public site: NavbarLayout + <Outlet> + AppFooter
├── AuthLayout.jsx            # guest pages (login / register / reset)
├── UserLayout.jsx            # user dashboard: DashboardNavbar, MobileBottomNav, AppFooter
├── SupplierLayout.jsx        # PanelLayout + supplier nav and badges
├── AdminLayout.jsx           # PanelLayout + admin nav
├── panel/                    # supplier / admin panel chrome
│   ├── PanelLayout.jsx       # sidebar, top bar, account menu
│   ├── PanelPage.jsx         # page frame (width + theme)
│   ├── PanelPageHeader.jsx
│   ├── PanelBackButton.jsx
│   └── panelPageTheme.js     # panelPageTheme, panelPageWidths, button classes
├── footer/
│   └── AppFooter.jsx         # shared by RootLayout and UserLayout
└── doc/STRUCTURE.md
```

## Where things go

| Thing | Location |
|---|---|
| New role / route layout | `layouts/<Name>Layout.jsx`, wired in `store/router/*.routes.jsx` |
| Panel page frame pieces | `layouts/panel/` (import `@/layouts/panel/PanelPage` etc.) |
| Dashboard navbar / sidebars | `@/components/navigation` |
| Messenger route element | `@/modules/messages` (`route/ChatLayout`) |
