import DashboardPage from "@/components/layout/DashboardPage";
import SearchFilterSidebar from "../components/layout/SearchFilterSidebar";
import SearchHeader from "../components/layout/SearchHeader";
import SearchPrompt from "../components/layout/SearchPrompt";
import SearchResultsPanel from "../components/results/SearchResultsPanel";
import { useSearchPage } from "../hooks/useSearchPage";
import { ALL_TAB_GROUP_LIMIT } from "../constant/constants";

const SearchView = () => {
  const search = useSearchPage();

  return (
    <DashboardPage width="6xl" className="flex flex-col items-start gap-6 md:flex-row">
      {search.query ? (
        <SearchFilterSidebar activeTab={search.activeTab} onChange={search.setActiveTab} />
      ) : null}

      <section className="w-full min-w-0 flex-1 rounded-lg border border-[#E4E7EC] bg-white p-6">
        <SearchHeader query={search.query} activeTab={search.activeTab} />

        {search.query ? (
          <SearchResultsPanel
            groups={search.groups}
            activeTab={search.activeTab}
            loading={search.loading}
            error={search.error}
            allTabLimit={ALL_TAB_GROUP_LIMIT}
            onRetry={search.retry}
            onSelect={search.openResult}
            onShowAll={search.setActiveTab}
          />
        ) : (
          <SearchPrompt />
        )}
      </section>
    </DashboardPage>
  );
};

export default SearchView;
