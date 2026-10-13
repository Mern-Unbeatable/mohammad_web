import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import Container from "@/components/ui/Container";
import LatestHubCard from "@/components/data-display/BlogCard/LatestHubCard";
import BlogGridCard from "@/components/data-display/BlogCard/BlogGridCard";
import {
  fetchBlogs,
  fetchLatestBlogs,
  clearBlogsError,
  invalidateBlogsList,
  toBlogCardModel,
} from "@/features/user/blogs";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const BLOG_BASE = "/blogs";

const BlogsView = () => {
  const dispatch = useDispatch();
  const {
    blogs,
    blogsMeta,
    latestBlogs,
    blogsLoading,
    latestLoading,
    error,
  } = useSelector((state) => state.userBlogs);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const carouselRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateBlogsList());
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearBlogsError());
    const search = debouncedQuery.trim() || undefined;
    dispatch(fetchLatestBlogs(search ? { search } : {}));
    dispatch(
      fetchBlogs({
        page,
        pageSize: GRID_PAGE_SIZE,
        sort: "desc",
        ...(search ? { search } : {}),
      }),
    );
  }, [dispatch, page, debouncedQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const latestItems = useMemo(
    () => (latestBlogs || []).map(toBlogCardModel).filter(Boolean),
    [latestBlogs],
  );

  const archiveItems = useMemo(
    () => (blogs || []).map(toBlogCardModel).filter(Boolean),
    [blogs],
  );

  const totalPages = Math.max(1, blogsMeta?.totalPages || 1);

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateBlogsList());
    setPage(next);
  };

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector("[data-hub-card]");
    const gap = 16;
    const step = card ? card.offsetWidth + gap : 320;
    container.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <main>
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
              <span className="text-green-primary">
                for the Laboratory Industry.
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl px-1 text-[13px] leading-relaxed text-[#64748B] sm:mt-4 sm:text-[15px]">
              Explore expert articles, research summaries, training resources
              and industry news curated for QC, microbiology and validation
              professionals.
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
              onClick={() =>
                document
                  .getElementById("latest-hub")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
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

            {latestLoading ? (
              <>
                <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:hidden">
                  <CardSkeleton
                    variant="blogHub"
                    count={3}
                    className="flex gap-3"
                    itemClassName="w-[min(calc(100vw-2.5rem),320px)] shrink-0"
                  />
                </div>
                <div className="hidden md:block">
                  <CardSkeleton
                    variant="blogHub"
                    count={3}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  ref={carouselRef}
                  className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory md:hidden"
                >
                  {latestItems.length > 0 ? (
                    latestItems.map((article) => (
                      <div
                        key={article.id}
                        data-hub-card
                        className="w-[min(calc(100vw-2.5rem),320px)] shrink-0 snap-start"
                      >
                        <LatestHubCard
                          article={article}
                          blogBasePath={BLOG_BASE}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="px-1 py-6 text-[13px] text-[#64748B]">
                      No articles found.
                    </p>
                  )}
                </div>

                <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {latestItems.length > 0 ? (
                    latestItems.map((article) => (
                      <LatestHubCard
                        key={article.id}
                        article={article}
                        blogBasePath={BLOG_BASE}
                      />
                    ))
                  ) : (
                    <p className="col-span-full py-6 text-[13px] text-[#64748B]">
                      No articles found.
                    </p>
                  )}
                </div>
              </>
            )}
          </Container>
        </section>

        <section className="border-t border-[#E4E7EC] bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
          <Container>
            <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-deep-blue sm:mb-5 sm:text-[13px]">
              Previous Article
            </h2>

            {blogsLoading ? (
              <CardSkeleton
                variant="blogGrid"
                count={GRID_PAGE_SIZE}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              />
            ) : archiveItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {archiveItems.map((article) => (
                    <BlogGridCard
                      key={article.id}
                      article={article}
                      blogBasePath={BLOG_BASE}
                    />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            ) : (
              <p className="py-8 text-center text-[13px] text-[#64748B]">
                No articles found.
              </p>
            )}
          </Container>
        </section>
      </div>
    </main>
  );
};

export default BlogsView;
