# Navigation structure

User dashboard chrome: top navbar (search, nav links, hover previews,
profile menu, mobile drawer), mobile bottom nav, and the feed's left/right
sidebars. Rendered by `layouts/UserLayout` (navbar + bottom nav) and
`modules/user/pages/feed/FeedView` (sidebars).

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
│   │                            # ConversationSkeleton, PreviewEmpty, ProfileDropdown
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
├── utils/                       # pure: navActive, badges, membership, sidebarModels
├── test/
└── doc/STRUCTURE.md
```

## Public API (`@/components/navigation`)

| Export | Used by |
|---|---|
| `DashboardNavbar`, `MobileBottomNav` | `layouts/UserLayout` |
| `LeftSidebar`, `RightSidebar` | `modules/user/pages/feed/FeedView` |

## Rules

- Components render only; state, effects, fetching and toasts live in hooks.
- `MobileBottomNav` reads badge counts from the store; `useNavBadges` (in the
  navbar) keeps them fresh.
- Utils are pure and unit-tested.
