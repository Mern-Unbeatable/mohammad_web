import BlogsHero from '../components/hub/BlogsHero';
import LatestHubSection from '../components/hub/LatestHubSection';
import ArchiveSection from '../components/hub/ArchiveSection';
import { useBlogsHub } from '../hooks/useBlogsHub';

const BlogsView = () => {
  const hub = useBlogsHub();

  return (
    <main>
      <div className="pb-8 pt-0 sm:pb-10">
        <BlogsHero query={hub.query} onQueryChange={hub.setQuery} />
        <LatestHubSection items={hub.latestItems} loading={hub.latestLoading} />
        <ArchiveSection
          items={hub.archiveItems}
          loading={hub.archiveLoading}
          page={hub.page}
          totalPages={hub.totalPages}
          onPageChange={hub.changePage}
        />
      </div>
    </main>
  );
};

export default BlogsView;
