import { ChevronLeft, ChevronRight } from "lucide-react";

const arrowClass =
  "flex h-8 w-8 items-center justify-center rounded-full border border-[#E67E22]/40 text-[#E67E22] hover:bg-[#FEF3E8] sm:h-9 sm:w-9";

/** Previous / next arrows for the mobile carousel. */
const CarouselControls = ({ onScroll }) => (
  <div className="flex gap-2 md:hidden">
    <button
      type="button"
      onClick={() => onScroll(-1)}
      aria-label="Previous articles"
      className={arrowClass}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <button
      type="button"
      onClick={() => onScroll(1)}
      aria-label="Next articles"
      className={arrowClass}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

export default CarouselControls;
