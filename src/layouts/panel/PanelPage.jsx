import { panelPageTheme, panelPageWidths } from './panelPageTheme';

const PanelPage = ({ children, className = '', width = 'full' }) => (
  <div className={`${panelPageTheme.page} ${panelPageWidths[width]} ${className}`.trim()}>
    {children}
  </div>
);

export default PanelPage;
