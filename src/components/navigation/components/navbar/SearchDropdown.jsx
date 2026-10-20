import { Search } from "lucide-react";
import { SearchResultsList, SearchTabs } from "@/modules/dash/user/pages/search";
import { ALL_TAB_GROUP_LIMIT } from "../../constant/constants";

const SearchDropdown = ({
  open,
  loading,
  groups,
  activeTab,
  onTabChange,
  onSelect,
  onSeeAll,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-x-2 top-[60px] z-[80] flex flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+6px)] sm:w-[max(100%,32rem)] sm:max-w-[calc(100vw-1rem)] xl:left-0 xl:right-auto">
      <SearchTabs
        activeTab={activeTab}
        onChange={onTabChange}
        className="px-1 sm:px-2"
      />

      <div
        role="tabpanel"
        className="max-h-[min(400px,calc(100dvh_-_14rem))] overflow-y-auto overscroll-contain py-2"
      >
        <SearchResultsList
          groups={groups}
          activeTab={activeTab}
          loading={loading}
          allTabLimit={ALL_TAB_GROUP_LIMIT}
          onSelect={onSelect}
          onShowAll={onTabChange}
        />
      </div>

      <button
        type="button"
        onClick={onSeeAll}
        className="flex shrink-0 items-center justify-center gap-2 border-t border-gray-200 px-4 py-2.5 text-[13px] font-semibold text-blue-600 hover:bg-[#F9FAFB]"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        See all results
      </button>
    </div>
  );
};

export default SearchDropdown;
