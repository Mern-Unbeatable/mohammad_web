import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

export const GENERAL_PATH = '/general';
export const MY_GENERAL_POSTS_PATH = `${GENERAL_PATH}/my-posts`;
export const generalPostPath = (id) => `${GENERAL_PATH}/${id}`;

/** `activeView` values for `GeneralToolbar`; supplier and admin pass the same strings. */
export const GENERAL_VIEW = { BROWSE: 'browse', MINE: 'mine' };

export const DEFAULT_CATEGORY = 'All';
export const POSTS_PAGE_SIZE = GRID_PAGE_SIZE;
export const POSTS_GRID_CLASS = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export const POST_TYPE = { NEWS: 'news', DOCUMENT: 'document' };
export const POST_TYPE_STYLES = {
  [POST_TYPE.NEWS]: 'bg-[#FEF3E8] text-[#E67E22]',
  [POST_TYPE.DOCUMENT]: 'bg-pink-secondary text-pink-light',
};
