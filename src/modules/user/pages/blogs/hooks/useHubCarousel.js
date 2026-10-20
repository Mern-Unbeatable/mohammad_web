import { useRef } from 'react';
import { CAROUSEL_FALLBACK_STEP_PX, CAROUSEL_GAP_PX } from '../constant/constants';

/** Ref for the mobile carousel and `scroll(direction)` that moves one card. */
export const useHubCarousel = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector('[data-hub-card]');
    const step = card ? card.offsetWidth + CAROUSEL_GAP_PX : CAROUSEL_FALLBACK_STEP_PX;
    container.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return { carouselRef, scroll };
};
