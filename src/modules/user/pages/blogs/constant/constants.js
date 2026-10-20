import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

export const BLOG_BASE_PATH = '/blogs';
export const blogDetailPath = (slug) => `${BLOG_BASE_PATH}/${slug}`;

export const BLOGS_PAGE_SIZE = GRID_PAGE_SIZE;
export const BLOG_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
export const SEARCH_DEBOUNCE_MS = 350;

export const LATEST_HUB_SECTION_ID = 'latest-hub';
export const LATEST_HUB_SKELETON_COUNT = 3;
/** Horizontal gap between carousel cards, matching `gap-3`/`gap-4` spacing. */
export const CAROUSEL_GAP_PX = 16;
/** Scroll step when no card is rendered to measure. */
export const CAROUSEL_FALLBACK_STEP_PX = 320;
export const HUB_CARD_WIDTH_CLASS = 'w-[min(calc(100vw-2.5rem),320px)] shrink-0';

export const POPULAR_POSTS_LIMIT = 5;
