import { panelPageTheme } from "@/components/navigation/panel/panelPageTheme";

/** Card header with a tinted icon tile, title and subtitle. */
const SectionHeader = ({ icon, iconClass, title, subtitle }) => {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <h2 className={panelPageTheme.cardTitle}>{title}</h2>
        <p className={panelPageTheme.cardSubtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
