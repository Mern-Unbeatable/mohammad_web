# Layout structure

Page frames: the block a route page renders inside its role shell. Shells
(`<main>` owners) live in `src/layouts`; these components never render
`<main>`.

```
components/layout/
├── DashboardPage.jsx      # user-dashboard frame: width + vertical spacing around a Container
├── dashboardPageTheme.js  # dashboardPageWidths, dashboardPageSpacing
├── PanelPage.jsx          # supplier / admin frame: width + layout (stack | fill | bleed)
├── panelPageTheme.js      # panelPageTheme, panelPageWidths, panelPageLayouts, button classes
├── PanelPageHeader.jsx
├── BackLink.jsx            Round blue "back" control (link with `to`, button with `onClick`)
├── PanelBackButton.jsx     BackLink that goes back in history, with a fallback route
└── doc/STRUCTURE.md
```

## Layers

| Layer          | Where                                   | Owns                                                |
| -------------- | --------------------------------------- | --------------------------------------------------- |
| App root       | `layouts/AppRootLayout`                 | `ScrollToTop` (once), `RouterErrorPage` boundary    |
| Guards         | `shared/router/guards`                  | session / role redirects; no markup                 |
| Role shells    | `layouts/RootLayout`, `UserLayout`, `AuthLayout`, `layouts/panel/PanelLayout` | header / nav, the `<main>` landmark, footer |
| Page frames    | `DashboardPage`, `PanelPage`            | width, vertical rhythm, bleed / fill variants       |
| Feature frames | e.g. `BlogDetailFrame` in `data-display/BlogHub/BlogDetail` | layout shared by one feature across roles |
| Overlays       | `components/modals`                     | fixed-position dialogs; scroll lock via `@/shared/hooks/useBodyScrollLock` |
| 404s           | `layouts/NotFoundLayout`, panel `*` routes | role-aware not-found shell                       |

## Layout variables (`src/index.css`)

| Scope              | Variable / utility                          | Use                                              |
| ------------------ | ------------------------------------------- | ------------------------------------------------ |
| `.dashboard-shell` | `--dashboard-header-h`, `--bottom-nav-h`    | mobile header, bottom nav, fixed chat panes      |
|                    | `pb-safe-nav`, `bottom-safe-nav`            | clear the bottom nav + safe-area inset           |
| `.panel-shell`     | `--panel-header-h`, `--panel-gutter`        | panel top bar (0 from `lg`) and `<main>` padding |
|                    | `panel-fill-height`, `panel-bleed`          | `PanelPage layout="fill"` / `layout="bleed"`     |

Change a header height or gutter in `index.css` only; the shells, page frames
and chat panes read the variables.

## Rules

- Pages render exactly one frame and never their own `<main>`.
- `className` on `DashboardPage` styles the inner container (page grids, flex rows).
- Full-width pages (the blog hub) skip `DashboardPage` and set their own containers;
  inside panels they use `PanelPage layout="bleed"` instead of negative margins.
