import BlogsHero from './BlogsHero';
import LatestHubSection from './LatestHubSection';
import ArchiveSection from './ArchiveSection';

/**
 * Full-width blog hub (hero, latest carousel, paged archive). Sections set
 * their own containers, so the parent must not constrain the width. `hub` is
 * the role's `useBlogsHub()` result; `basePath` builds article links.
 */
const BlogsHub = ({ hub, basePath, pageSize }) => (
  <div className="pb-8 pt-0 sm:pb-10">
    <BlogsHero query={hub.query} onQueryChange={hub.setQuery} />
    <LatestHubSection items={hub.latestItems} loading={hub.latestLoading} basePath={basePath} />
    <ArchiveSection
      items={hub.archiveItems}
      loading={hub.archiveLoading}
      page={hub.page}
      totalPages={hub.totalPages}
      onPageChange={hub.changePage}
      basePath={basePath}
      pageSize={pageSize}
    />
  </div>
);

export default BlogsHub;
