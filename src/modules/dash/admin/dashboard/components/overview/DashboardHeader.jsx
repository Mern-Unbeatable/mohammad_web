import { Select } from "@/components/form-controls";
import PanelPageHeader from "@/components/layout/PanelPageHeader";

/** Page title and the statistics year picker. */
const DashboardHeader = ({
  years,
  year,
  onYearChange,
  title = "Dashboard",
  subtitle = "Overview of your Lab Unity platform.",
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <PanelPageHeader title={title} subtitle={subtitle} />
    <label className="relative inline-flex min-w-[120px] shrink-0 items-center self-start">
      <span className="sr-only">Statistics year</span>
      <Select variant="compact" value={year} onChange={(e) => onYearChange(e.target.value)}>
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  </div>
);

export default DashboardHeader;
