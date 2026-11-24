import { panelPageTheme } from './panelPageTheme';

const PanelPageHeader = ({ title, subtitle, action, className = '' }) => (
  <div
    className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
  >
    <div className="min-w-0">
      <h1 className={panelPageTheme.title}>{title}</h1>
      {subtitle ? <p className={panelPageTheme.subtitle}>{subtitle}</p> : null}
    </div>
    {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
  </div>
);

export default PanelPageHeader;
