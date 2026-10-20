import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import Pagination from '@/components/common/Pagination/Pagination';
import Container from '@/components/ui/Container';
import LatestHubCard from '@/components/data-display/BlogCard/LatestHubCard';
import BlogGridCard from '@/components/data-display/BlogCard/BlogGridCard';
import { archiveArticles, latestArticles } from '@/modules/dash/user/data/blogs';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const BlogsPageContent = ({ blogBasePath = '/blogs' }) => {
  const [query, setQuery] = useState('');
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector('[data-hub-card]');
    const gap = 16;
    const step = card ? card.offsetWidth + gap : 320;
    container.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const q = query.trim().toLowerCase();
  const filteredLatest = q
    ? latestArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : latestArticles;

  const filteredArchive = q
    ? archiveArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : archiveArticles;

  const { page, setPage, totalPages, pageItems: archivePageItems } = usePaginatedList(
    filteredArchive,
    GRID_PAGE_SIZE,
    [query]
  );

  return (
    <div className="pb-8 pt-0 sm:pb-10">
      <section className="border-b border-[#E4E7EC] bg-gradient-to-b from-secondary to-white py-8 sm:py-12 lg:py-14">
        <Container className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B] sm:text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-[#E67E22]" />
            Lab Unity Knowledge Hub
          </span>

          <h1 className="mx-auto mt-4 max-w-3xl text-[24px] font-bold leading-tight text-deep-blue sm:mt-5 sm:text-[34px] lg:text-[40px] lg:leading-[1.15]">
            Insights, Knowledge &amp; Opportunities
            <br className="hidden sm:block" />
            <span className="sm:ml-0"> </span>
            <span className="text-green-primary">for the Laboratory Industry.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl px-1 text-[13px] leading-relaxed text-[#64748B] sm:mt-4 sm:text-[15px]">
            Explore expert articles, research summaries, training resources and industry news
            curated for QC, microbiology and validation professionals.
          </p>

          <div className="mx-auto mt-5 max-w-xl sm:mt-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, research..."
                className="w-full rounded-full border border-[#E4E7EC] bg-white py-2.5 pl-11 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:py-3 sm:text-[14px]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => document.getElementById('latest-hub')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#066BB0] sm:mt-5 sm:px-5 sm:text-[13px]"
          >
            Explore Articles
            <ArrowRight className="h-4 w-4" />
          </button>
        </Container>
      </section>

      <section id="latest-hub" className="py-6 sm:py-8 lg:py-10">
        <Container>
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-deep-blue sm:text-[13px]">
              Latest From The Hub
            </h2>
            <div className="flex gap-2 md:hidden">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous articles"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E67E22]/40 text-[#E67E22] hover:bg-[#FEF3E8] sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next articles"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E67E22]/40 text-[#E67E22] hover:bg-[#FEF3E8] sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory md:hidden"
          >
            {filteredLatest.length > 0 ? (
              filteredLatest.map((article) => (
                <div key={article.id} data-hub-card className="w-[min(calc(100vw-2.5rem),320px)] shrink-0 snap-start">
                  <LatestHubCard article={article} blogBasePath={blogBasePath} />
                </div>
              ))
            ) : (
              <p className="px-1 py-6 text-[13px] text-[#64748B]">No articles found.</p>
            )}
          </div>

          <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {filteredLatest.length > 0 ? (
              filteredLatest.map((article) => (
                <LatestHubCard key={article.id} article={article} blogBasePath={blogBasePath} />
              ))
            ) : (
              <p className="col-span-full py-6 text-[13px] text-[#64748B]">No articles found.</p>
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-[#E4E7EC] bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
        <Container>
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-deep-blue sm:mb-5 sm:text-[13px]">
            Previous Article
          </h2>

          {filteredArchive.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {archivePageItems.map((article) => (
                  <BlogGridCard key={article.id} article={article} blogBasePath={blogBasePath} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-8"
              />
            </>
          ) : (
            <p className="py-8 text-center text-[13px] text-[#64748B]">No articles found.</p>
          )}
        </Container>
      </section>
    </div>
  );
};

export default BlogsPageContent;
