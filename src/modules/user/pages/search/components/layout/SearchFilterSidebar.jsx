import SearchTabs from "../tabs/SearchTabs";

/** Sticky "Filter results" card with the vertical category tabs. */
const SearchFilterSidebar = ({ activeTab, onChange }) => (
  <aside className="w-full rounded-lg border border-[#E4E7EC] bg-white p-4 md:sticky md:top-20 md:w-64 md:shrink-0 xl:top-[86px]">
    <h2 className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
      Filter results
    </h2>
    <SearchTabs activeTab={activeTab} onChange={onChange} orientation="vertical" />
  </aside>
);

export default SearchFilterSidebar;
