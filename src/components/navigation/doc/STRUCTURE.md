# Navigation structure

App chrome: the public (marketing) navbar; the user dashboard's top navbar
(search, nav links, hover previews, profile menu, mobile drawer), mobile
bottom nav and the feed's left/right sidebars; and the site footer.
Rendered by `layouts/*Layout.jsx` and `modules/dash/user/feed/FeedView`
(sidebars). The supplier / admin panel shell lives in `layouts/panel/` and the
page frames (`PanelPage`, `DashboardPage`) in `@/components/layout/`.

```
components/navigation/
├── index.js                     # public API (see below)
├── constant/constants.js        # nav items, bottom tabs, quick links, paths,
│                                # search / hover / preview / sidebar limits
├── components/
│   ├── public-navbar/           # PublicNavbar, PublicMobileMenu, PublicAuthActions
│   │                            # (home + legal pages, via layouts/RootLayout)
│   ├── navbar/                  # DashboardNavbar, MobileHeader, DesktopHeader,
│   │                            # DesktopNavLinks, NavSearchField, SearchDropdown,
│   │                            # MobileMenuDrawer
│   ├── menus/                   # NavHoverMenu, MessagesHoverMenu,
│   │                            # NotificationsHoverMenu, NotificationPreviewItem,
│   │                            # PreviewEmpty, ProfileDropdown
│   │                            # (ConversationSkeleton: @/components/loader)
│   ├── bottom-nav/MobileBottomNav.jsx
│   ├── left-sidebar/            # LeftSidebar, ProfileCard, TrialCard,
│   │                            # QuickLinksCard, MetaLine
│   ├── right-sidebar/           # RightSidebar, PeopleYouMayKnow, MarketplaceList,
│   │                            # JobsList, SidebarSection (SectionTitle, EmptyRow)
│   └── membership/ViewPlansLink.jsx
├── hooks/
│   ├── useNavBadges.js          # unread / pending / application counts + labels
│   ├── useNavSearch.js          # debounced global search + dropdown handlers
│   ├── useLogout.js
│   ├── useDropdown.js           # click-outside / Escape menu state
│   ├── useHoverMenu.js          # delayed hover open/close
│   ├── useMessagesPreview.js
│   ├── useNotificationsPreview.js
│   ├── useRightSidebar.js       # people / listings / jobs + Connect
│   ├── usePublicNavbar.js       # public navbar: mobile menu, section scroll / `/#section` navigation
│   └── usePublicAuthActions.js  # public navbar: auth state, logout back to `/`
├── footer/AppFooter.jsx         # site footer (RootLayout, UserLayout)
├── test/                        # navUtils.test.js covers @/shared/utils/nav
└── doc/STRUCTURE.md
```

## Public API (`@/components/navigation`)

| Export | Used by |
|---|---|
| `PublicNavbar` | `layouts/RootLayout` |
| `DashboardNavbar`, `MobileBottomNav` | `layouts/UserLayout` |
| `LeftSidebar`, `RightSidebar` | `modules/dash/user/feed/FeedView` |

`footer/AppFooter` is imported by file path (Root / User layouts).

Related chrome outside this folder:

- `layouts/panel/PanelLayout.jsx`: supplier / admin sidebar, top bar and
  account menu (Supplier / Admin layouts).
- `@/components/layout/`: `PanelPage`, `PanelPageHeader`, `PanelBackButton`,
  `panelPageTheme` (panel pages) and `DashboardPage` (user pages).
- `@/shared/hooks/useBodyScrollLock`: ref-counted scroll lock used by the
  mobile drawers and modals.
- `@/shared/context/useCreatePostAction` and `useLayoutChrome`: the bottom
  nav's "create post" action and hide flag, provided by `UserLayout`.

## Rules

- Components render only; state, effects, fetching and toasts live in hooks.
- `MobileBottomNav` reads badge counts from the store; `useNavBadges` (in the
  navbar) keeps them fresh.
- Pure helpers (`navActive`, `badges`, `membership`, `sidebarModels`) live in
  `@/shared/utils/nav`; they read `constant/constants.js` from this folder and
  are unit-tested in `test/navUtils.test.js`.
