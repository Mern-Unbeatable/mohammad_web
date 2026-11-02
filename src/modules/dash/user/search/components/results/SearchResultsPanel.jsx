import { RotateCw } from "lucide-react";
import SearchResultsList from "./SearchResultsList";

/** Results area on /search: error with retry, or the grouped list (dimmed while refreshing). */
const SearchResultsPanel = ({
  groups,
  activeTab,
  loading,
  error,
  allTabLimit,
  onRetry,
  onSelect,
  onShowAll,
}) => (
  <div
    role="tabpanel"
    aria-busy={loading}
    className={`-mx-4 mt-4 transition-opacity duration-200 ${
      loading && groups.length ? "opacity-60" : ""
    }`}
  >
    {error ? (
      <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
        <p className="text-[13px] text-[#B42318]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-[13px] font-semibold text-[#344054] hover:bg-[#F9FAFB]"
        >
          <RotateCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
      </div>
    ) : (
      <SearchResultsList
        groups={groups}
        activeTab={activeTab}
        loading={loading}
        allTabLimit={allTabLimit}
        onSelect={onSelect}
        onShowAll={onShowAll}
      />
    )}
  </div>
);

export default SearchResultsPanel;
