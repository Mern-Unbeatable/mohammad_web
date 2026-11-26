export const PUBLIC_GENERAL_PATH = '/general-posts';
export const publicGeneralPostPath = (id) => `${PUBLIC_GENERAL_PATH}/${id}`;

export const LOGIN_PATH = '/login';
export const JOIN_PATH = '/join';

/** Soft guest detail-view cap (aligned with server `GUEST_GENERAL_VIEW_LIMIT`). */
export const GUEST_VIEW_LIMIT = 12;

export const GUEST_VIEWS_STORAGE_KEY = 'lu_guest_general_views';

/** Guest list preview size on `/general-posts`. */
export const PUBLIC_POSTS_PAGE_SIZE = 8;
export const RELATED_POSTS_LIMIT = 4;

export const POSTS_GRID_CLASS =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export const DEFAULT_CATEGORY = 'All';
