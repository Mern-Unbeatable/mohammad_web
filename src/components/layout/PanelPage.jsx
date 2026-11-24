import { panelPageLayouts, panelPageTheme, panelPageWidths } from './panelPageTheme';

/**
 * Page frame for supplier/admin routes, rendered inside `PanelLayout`'s `<main>`.
 * `layout="fill"` gives a viewport-height column (chat); `layout="bleed"`
 * cancels the panel gutter for edge-to-edge pages.
 */
const PanelPage = ({ children, className = '', width = 'full', layout = 'stack' }) => (
  <div
    className={`${panelPageTheme.page} ${panelPageLayouts[layout]} ${panelPageWidths[width]} ${className}`
      .replace(/\s+/g, ' ')
      .trim()}
  >
    {children}
  </div>
);

export default PanelPage;
