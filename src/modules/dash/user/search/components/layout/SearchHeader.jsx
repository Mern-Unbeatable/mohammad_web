import { DEFAULT_SEARCH_TAB } from "../../constant/constants";
import { searchTabLabel } from "../../utils/searchTabs";

/** Page title and "Showing … for “query”" line. */
const SearchHeader = ({ query, activeTab }) => (
  <header>
    <h1 className="text-[18px] font-bold text-deep-blue sm:text-[20px]">
      {query ? "Search results" : "Search"}
    </h1>
    {query ? (
      <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
        Showing{" "}
        {activeTab === DEFAULT_SEARCH_TAB
          ? "all matches"
          : searchTabLabel(activeTab).toLowerCase()}{" "}
        for <span className="font-semibold text-deep-blue">“{query}”</span>
      </p>
    ) : null}
  </header>
);

export default SearchHeader;
