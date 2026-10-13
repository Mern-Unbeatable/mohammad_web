import { Link } from "react-router";
import { Briefcase, List, Plus, Search } from "lucide-react";
import { levels } from "@/modules/user/data/recruitment";
import { SEARCH_MAX_LENGTH } from "@/shared/utils/urlFilters";

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

const RecruitmentToolbar = ({
  query,
  onQueryChange,
  level,
  onLevelChange,
  activeView = "browse",
  basePath = "/recruitment",
  showTitle = true,
  showActions = true,
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
          <div className="flex flex-wrap gap-2">
            <Link
              to={basePath}
              className={`${actionBtn} ${
                activeView === "browse"
                  ? "bg-[#E8F3FB] text-primary"
                  : "border border-primary/30 text-primary hover:bg-[#E8F3FB]"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              All Jobs
            </Link>
            <Link
              to={`${basePath}/my-jobs`}
              className={`${actionBtn} ${
                activeView === "mine"
                  ? "bg-green-secondary text-green-primary"
                  : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              My Job Post
            </Link>
            <Link
              to={`${basePath}/create`}
              className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}
            >
              <Plus className="h-3.5 w-3.5" />
              Post Job
            </Link>
          </div>
        ) : null}
      </div>
    )}

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          maxLength={SEARCH_MAX_LENGTH}
          placeholder="Search by title, company, or location..."
          className="w-full rounded-lg border border-[#E4E7EC] bg-white py-2.5 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

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
    </div>
  </div>
);

export default RecruitmentToolbar;
