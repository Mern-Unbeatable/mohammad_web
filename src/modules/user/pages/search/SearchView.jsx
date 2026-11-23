import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { RotateCw, Search } from "lucide-react";
import { toSearchResultsModel, useGlobalSearch } from "@/features/user/search";
import SearchTabs from "@/modules/user/components/search/SearchTabs";
import SearchResultsList from "@/modules/user/components/search/SearchResultsList";
import {
  DEFAULT_SEARCH_TAB,
  isSearchTab,
  searchTabLabel,
  toSearchGroups,
} from "@/modules/user/components/search/searchResults";

const PAGE_FETCH_LIMIT = 20;
const ALL_TAB_GROUP_LIMIT = 5;

const SearchView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const tabParam = searchParams.get("tab");
  const activeTab = isSearchTab(tabParam) ? tabParam : DEFAULT_SEARCH_TAB;

  const { results, loading, error, retry } = useGlobalSearch(query, {
    limit: PAGE_FETCH_LIMIT,
  });
  const groups = useMemo(
    () => toSearchGroups(toSearchResultsModel(results)),
    [results],
  );

  const setActiveTab = (tab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tab === DEFAULT_SEARCH_TAB) next.delete("tab");
        else next.set("tab", tab);
        return next;
      },
      { replace: true },
    );
  };

  const handleSelect = (href) => {
    if (href && href !== "#") navigate(href);
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-6 md:flex-row">
      {query ? (
        <aside className="w-full rounded-lg border border-[#E4E7EC] bg-white p-4 md:sticky md:top-20 md:w-64 md:shrink-0 xl:top-[86px]">
          <h2 className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Filter results
          </h2>
          <SearchTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            orientation="vertical"
          />
        </aside>
      ) : null}

      <section className="w-full min-w-0 flex-1 rounded-lg border border-[#E4E7EC] bg-white p-6">
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
              for{" "}
              <span className="font-semibold text-deep-blue">“{query}”</span>
            </p>
          ) : null}
        </header>

        {query ? (
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
                  onClick={retry}
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
                allTabLimit={ALL_TAB_GROUP_LIMIT}
                onSelect={handleSelect}
                onShowAll={setActiveTab}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 pb-6 pt-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F3FB] text-primary">
              <Search aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="text-[14px] font-semibold text-deep-blue">
              Search Lab Unity
            </p>
            <p className="max-w-[320px] text-[13px] text-[#64748B]">
              Type in the search bar and press Enter to find people, jobs, blogs
              and listings.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchView;
