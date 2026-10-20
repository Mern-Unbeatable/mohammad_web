import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

export const MARKETPLACE_PATH = '/marketplace';
export const SAVED_LISTINGS_PATH = `${MARKETPLACE_PATH}/saved`;
export const MY_LISTINGS_PATH = `${MARKETPLACE_PATH}/my-listings`;
export const CREATE_LISTING_PATH = `${MARKETPLACE_PATH}/create`;
export const listingDetailPath = (id) => `${MARKETPLACE_PATH}/${id}`;
export const editListingPath = (id) => `${MARKETPLACE_PATH}/${id}/edit`;

export const MARKETPLACE_VIEW = { BROWSE: 'browse', SAVED: 'saved', MINE: 'mine' };

export const LISTINGS_PAGE_SIZE = GRID_PAGE_SIZE;
/** Saved and My listings load a single, larger page with no pagination. */
export const PERSONAL_LISTINGS_PAGE_SIZE = GRID_PAGE_SIZE * 3;
export const LISTINGS_GRID_CLASS =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export const SEARCH_DEBOUNCE_MS = 350;

export const CONDITION_TO_API = {
  New: 'NEW',
  'Like New': 'LIKE_NEW',
  Good: 'GOOD',
  Refurbished: 'REFURBISHED',
  'For Parts': 'FOR_PARTS',
};

export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 5000;
export const MIN_YEAR = 1980;
export const MAX_YEAR = 2100;
/** Index into `years` used for new listings and listings without a year. */
export const DEFAULT_YEAR_INDEX = 5;
/** Index into `conditions` used for new listings. */
export const DEFAULT_CONDITION_INDEX = 2;

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
export const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
export const MAX_PHOTOS = 12;
export const MAX_FILE_MB = 10;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const VISIBLE_THUMBNAILS = 4;
