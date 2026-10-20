import Container from "@/components/ui/Container";
import { CardSkeleton } from "@/components/loader";
import LatestHubCard from "@/components/data-display/BlogCard/LatestHubCard";
import { useHubCarousel } from "../../hooks/useHubCarousel";
import {
  BLOG_BASE_PATH,
  HUB_CARD_WIDTH_CLASS,
  LATEST_HUB_SECTION_ID,
  LATEST_HUB_SKELETON_COUNT,
} from "../../constant/constants";
import CarouselControls from "./CarouselControls";

/** Latest articles: a snap carousel on mobile, a grid from `md` up. */
const LatestHubSection = ({ items, loading }) => {
  const { carouselRef, scroll } = useHubCarousel();

  return (
    <section id={LATEST_HUB_SECTION_ID} className="py-6 sm:py-8 lg:py-10">
      <Container>
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-deep-blue sm:text-[13px]">
            Latest From The Hub
          </h2>
          <CarouselControls onScroll={scroll} />
        </div>

        {loading ? (
          <>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:hidden">
              <CardSkeleton
                variant="blogHub"
                count={LATEST_HUB_SKELETON_COUNT}
                className="flex gap-3"
                itemClassName={HUB_CARD_WIDTH_CLASS}
              />
            </div>
            <div className="hidden md:block">
              <CardSkeleton
                variant="blogHub"
                count={LATEST_HUB_SKELETON_COUNT}
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
              {items.length > 0 ? (
                items.map((article) => (
                  <div key={article.id} data-hub-card className={`${HUB_CARD_WIDTH_CLASS} snap-start`}>
                    <LatestHubCard article={article} blogBasePath={BLOG_BASE_PATH} />
                  </div>
                ))
              ) : (
                <p className="px-1 py-6 text-[13px] text-[#64748B]">No articles found.</p>
              )}
            </div>

            <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
              {items.length > 0 ? (
                items.map((article) => (
                  <LatestHubCard key={article.id} article={article} blogBasePath={BLOG_BASE_PATH} />
                ))
              ) : (
                <p className="col-span-full py-6 text-[13px] text-[#64748B]">No articles found.</p>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default LatestHubSection;
