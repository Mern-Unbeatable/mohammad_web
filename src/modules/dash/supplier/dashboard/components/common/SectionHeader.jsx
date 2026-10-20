import { Link } from "react-router";
import { panelPageTheme } from "@/components/navigation/panel/panelPageTheme";

/** Card title, subtitle and a "View All" link to the full page. */
const SectionHeader = ({ title, subtitle, viewAllTo, className = "" }) => (
  <div
    className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between ${className}`}
  >
    <div>
      <h2 className={panelPageTheme.cardTitle}>{title}</h2>
      <p className={panelPageTheme.cardSubtitle}>{subtitle}</p>
    </div>
    <Link
      to={viewAllTo}
      className="text-[13px] font-semibold text-primary hover:underline sm:text-[14px]"
    >
      View All →
    </Link>
  </div>
);

export default SectionHeader;
