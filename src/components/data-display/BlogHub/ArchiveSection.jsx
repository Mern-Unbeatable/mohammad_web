import Container from '@/components/ui/Container';
import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/loader';
import BlogGridCard from '@/components/data-display/BlogCard/BlogGridCard';
import { BLOG_GRID_CLASS } from './constants';

/** "Previous Article" paged grid; `pageSize` sizes the loading skeleton. */
const ArchiveSection = ({ items, loading, page, totalPages, onPageChange, basePath, pageSize }) => (
  <section className="border-t border-[#E4E7EC] bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
    <Container>
      <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-deep-blue sm:mb-5 sm:text-[13px]">
        Previous Article
      </h2>

      {loading ? (
        <CardSkeleton variant="blogGrid" count={pageSize} className={BLOG_GRID_CLASS} />
      ) : items.length > 0 ? (
        <>
          <div className={BLOG_GRID_CLASS}>
            {items.map((article) => (
              <BlogGridCard key={article.id} article={article} blogBasePath={basePath} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mt-8"
          />
        </>
      ) : (
        <p className="py-8 text-center text-[13px] text-[#64748B]">No articles found.</p>
      )}
    </Container>
  </section>
);

export default ArchiveSection;
