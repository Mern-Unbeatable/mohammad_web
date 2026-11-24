import { DEFAULT_SEARCH_TAB, SEARCH_TYPE_ICONS } from "../../constant/constants";
import { filterSearchGroups } from "../../utils/searchResults";
import { searchTabLabel } from "../../utils/searchTabs";
import SearchResultRow from "./SearchResultRow";

/**
 * Grouped search results for the active tab. Shared by the navbar dropdown
 * and the /search page.
 */
const SearchResultsList = ({
  groups,
  activeTab,
  loading,
  allTabLimit,
  onSelect,
  onShowAll,
}) => {
  const isAll = activeTab === DEFAULT_SEARCH_TAB;
  const visibleGroups = filterSearchGroups(groups, activeTab, allTabLimit);

  if (!visibleGroups.length) {
    return (
      <p className="px-4 py-3 text-[13px] text-[#64748B]">
        {loading
          ? "Searching…"
          : isAll
            ? "No results found"
            : `No ${searchTabLabel(activeTab).toLowerCase()} found`}
      </p>
    );
  }

  return visibleGroups.map((group) => {
    const GroupIcon = SEARCH_TYPE_ICONS[group.type];
    const total = groups.find((g) => g.type === group.type)?.items.length ?? 0;
    const canShowAll =
      isAll && onShowAll && group.type !== "posts" && total > allTabLimit;
    return (
      <div key={group.type} className="py-1">
        {isAll ? (
          <div className="flex items-center justify-between px-4 py-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
              <GroupIcon aria-hidden="true" className="h-3.5 w-3.5" />
              {group.label}
            </p>
            {canShowAll ? (
              <button
                type="button"
                onClick={() => onShowAll(group.type)}
                className="text-[12px] font-semibold text-blue-600 hover:underline"
              >
                See all
              </button>
            ) : null}
          </div>
        ) : null}
        {group.items.map((item) => (
          <SearchResultRow
            key={`${group.type}-${item.id || item.slug}`}
            item={item}
            type={group.type}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  });
};

export default SearchResultsList;
