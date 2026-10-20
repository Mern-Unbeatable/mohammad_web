# Navigation structure

App chrome: the user dashboard's top navbar (search, nav links, hover
previews, profile menu, mobile drawer), mobile bottom nav and the feed's
left/right sidebars; the supplier / admin panel shell; and the site footer.
Rendered by `layouts/*Layout.jsx`, `modules/dash/user/pages/feed/FeedView`
(sidebars) and the supplier / admin pages (panel page frame).

```
components/navigation/
├── index.js                     # public API (see below)
├── constant/constants.js        # nav items, bottom tabs, quick links, paths,
│                                # search / hover / preview / sidebar limits
├── components/
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
│   ├── useBodyScrollLock.js     # while the mobile drawer is open
│   ├── useLogout.js
│   ├── useDropdown.js           # click-outside / Escape menu state
│   ├── useHoverMenu.js          # delayed hover open/close
│   ├── useMessagesPreview.js
│   ├── useNotificationsPreview.js
│   └── useRightSidebar.js       # people / listings / jobs + Connect
├── panel/                       # supplier / admin panel chrome
│   ├── PanelLayout.jsx          # sidebar, top bar, account menu
│   ├── PanelPage.jsx            # page frame (width + theme)
│   ├── PanelPageHeader.jsx
│   ├── PanelBackButton.jsx
│   └── panelPageTheme.js        # panelPageTheme, panelPageWidths, button classes
├── footer/AppFooter.jsx         # site footer (RootLayout, UserLayout)
├── test/                        # navUtils.test.js covers @/shared/utils/nav
└── doc/STRUCTURE.md
```

## Public API (`@/components/navigation`)

| Export | Used by |
|---|---|
| `DashboardNavbar`, `MobileBottomNav` | `layouts/UserLayout` |
| `LeftSidebar`, `RightSidebar` | `modules/dash/user/pages/feed/FeedView` |

`panel/*` and `footer/AppFooter` are imported by file path:
`@/components/navigation/panel/PanelLayout` (Supplier / Admin layouts),
`panel/PanelPage`, `PanelPageHeader`, `PanelBackButton`, `panelPageTheme`
(supplier / admin pages, `CreateAdModal`, `AdminAccountForm`, `GeneralToolbar`)
and `footer/AppFooter` (Root / User layouts).

## Rules

- Components render only; state, effects, fetching and toasts live in hooks.
- `MobileBottomNav` reads badge counts from the store; `useNavBadges` (in the
  navbar) keeps them fresh.
- Pure helpers (`navActive`, `badges`, `membership`, `sidebarModels`) live in
  `@/shared/utils/nav`; they read `constant/constants.js` from this folder and
  are unit-tested in `test/navUtils.test.js`.
