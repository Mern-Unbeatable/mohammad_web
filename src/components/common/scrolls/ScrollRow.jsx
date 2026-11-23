import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EDGE_TOLERANCE = 2;

const ArrowButton = ({ direction, onClick, fadeColor }) => {
  const isLeft = direction === 'left';
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 flex items-center ${
        isLeft ? 'left-0 pr-6' : 'right-0 pl-6'
      }`}
      style={{
        background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, ${fadeColor} 55%, transparent)`,
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={isLeft ? 'Scroll left' : 'Scroll right'}
        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-primary shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
};

/** Horizontally scrolling row with arrow buttons that appear only when there is more to scroll. */
const ScrollRow = ({ children, className = '', ariaLabel, fadeColor = '#F3F4F6' }) => {
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const update = () => {
      const left = el.scrollLeft > EDGE_TOLERANCE;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE;
      setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    };

    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, []);

  const scrollBy = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <div className="relative min-w-0">
      {edges.left ? (
        <ArrowButton direction="left" fadeColor={fadeColor} onClick={() => scrollBy(-1)} />
      ) : null}
      <div
        ref={scrollerRef}
        role="group"
        aria-label={ariaLabel}
        className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
      {edges.right ? (
        <ArrowButton direction="right" fadeColor={fadeColor} onClick={() => scrollBy(1)} />
      ) : null}
    </div>
  );
};

export default ScrollRow;
