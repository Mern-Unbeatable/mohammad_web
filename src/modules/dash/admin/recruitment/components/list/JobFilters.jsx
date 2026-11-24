import {
  RECRUITMENT_LEVEL_OPTIONS,
  RECRUITMENT_TIME_OPTIONS,
} from "@/features/dash/admin/recruitment";
import FilterSelect from "./FilterSelect";

/** Time and level selects shown in the page header. */
const JobFilters = ({ timeFilter, onTimeFilterChange, level, onLevelChange }) => (
  <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
    <FilterSelect
      label="Time filter"
      value={timeFilter}
      options={RECRUITMENT_TIME_OPTIONS}
      onChange={onTimeFilterChange}
    />
    <FilterSelect
      label="Level filter"
      value={level}
      options={RECRUITMENT_LEVEL_OPTIONS}
      onChange={onLevelChange}
    />
  </div>
);

export default JobFilters;
