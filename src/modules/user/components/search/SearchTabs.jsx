import { SEARCH_TABS, SEARCH_TYPE_ICONS } from "./searchResults";

const tabClass = (vertical, active) => {
  if (vertical) {
    return `flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
    }`;
  }
  return `-mb-px flex flex-1 shrink-0 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-[13px] transition-colors sm:flex-none sm:px-2.5 ${
    active
      ? "border-blue-600 font-semibold text-blue-600"
      : "border-transparent font-medium text-gray-500 hover:text-gray-700"
  }`;
};

const SearchTabs = ({
  activeTab,
  onChange,
  orientation = "horizontal",
  className = "",
}) => {
  const vertical = orientation === "vertical";
  return (
    <div
      role="tablist"
      aria-label="Search categories"
      aria-orientation={orientation}
      className={`${
        vertical
          ? "flex flex-col gap-1"
          : "flex shrink-0 overflow-x-auto border-b border-gray-200 [scrollbar-width:none]"
      } ${className}`}
    >
      {SEARCH_TABS.map((tab) => {
        const active = tab.id === activeTab;
        const TabIcon = SEARCH_TYPE_ICONS[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={tabClass(vertical, active)}
          >
            <TabIcon
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 ${vertical ? "" : "hidden min-[420px]:block"}`}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SearchTabs;
