import { Link } from "react-router";
import { Briefcase, List } from "lucide-react";
import { SearchInput } from "@/components/form-controls";
import CountBadge from "@/components/ui/CountBadge";
import { levels } from "@/modules/dash/user/data/recruitment";
import { SEARCH_MAX_LENGTH } from "@/shared/utils/urlFilters";
import FilterSelect from "./FilterSelect";

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

const RecruitmentToolbar = ({
  query,
  onQueryChange,
  level,
  onLevelChange,
  employmentType,
  employmentOptions,
  onEmploymentTypeChange,
  workplaceType,
  workplaceOptions,
  onWorkplaceTypeChange,
  /** Replaces the built-in filters after the search box. */
  filters,
  activeView = "browse",
  basePath = "/recruitment",
  showTitle = true,
  showActions = true,
  newApplications = 0,
}) => (
  <div className="space-y-4">
    {(showTitle || showActions) && (
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {showTitle ? (
          <div>
            <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">
              Recruitment
            </h1>
            <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
              Find your next laboratory-industry role or discover qualified
              candidates.
            </p>
          </div>
        ) : (
          <div />
        )}

        {showActions ? (
          <div className="flex flex-wrap justify-end gap-2 lg:justify-start">
            <Link
              to={basePath}
              className={`${actionBtn} ${
                activeView === "browse"
                  ? "bg-[#E8F3FB] text-primary"
                  : "border border-primary/30 text-primary hover:bg-[#E8F3FB]"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Public Job Posts
            </Link>
            <Link
              to={`${basePath}/my-jobs`}
              aria-label={
                newApplications
                  ? `My Job Posts, ${newApplications} new ${newApplications === 1 ? "application" : "applications"}`
                  : undefined
              }
              className={`relative ${actionBtn} ${
                activeView === "mine"
                  ? "bg-green-secondary text-green-primary"
                  : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              My Job Posts
              <CountBadge
                count={newApplications}
                className="absolute -right-2 -top-2"
              />
            </Link>
          </div>
        ) : null}
      </div>
    )}

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchInput
        className="flex-1"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        maxLength={SEARCH_MAX_LENGTH}
        placeholder="Search by title, company, or location..."
      />

      {filters ? (
        filters
      ) : onEmploymentTypeChange && onWorkplaceTypeChange ? (
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <FilterSelect
            label="Employment type"
            allLabel="All job types"
            options={employmentOptions}
            value={employmentType}
            onChange={onEmploymentTypeChange}
          />
          <FilterSelect
            label="Workplace type"
            allLabel="All workplaces"
            options={workplaceOptions}
            value={workplaceType}
            onChange={onWorkplaceTypeChange}
          />
          <FilterSelect
            label="Experience level"
            allLabel="All levels"
            options={levels}
            value={level}
            onChange={onLevelChange}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {levels.map((item) => {
            const isActive = level === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={isActive}
                onClick={() => onLevelChange(item)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  isActive
                    ? "bg-[#E67E22] text-white"
                    : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

export default RecruitmentToolbar;
