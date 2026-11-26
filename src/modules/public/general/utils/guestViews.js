import { GUEST_VIEW_LIMIT, GUEST_VIEWS_STORAGE_KEY } from '../constant/constants';

const LIMIT_FLAG_KEY = `${GUEST_VIEWS_STORAGE_KEY}_reached`;

const isValidId = (id) => typeof id === 'string' && id.length > 0;

export const readGuestViewedIds = () => {
  try {
    const raw = window.localStorage.getItem(GUEST_VIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter(isValidId))].slice(0, GUEST_VIEW_LIMIT);
  } catch {
    return [];
  }
};

export const writeGuestViewedIds = (ids) => {
  try {
    window.localStorage.setItem(
      GUEST_VIEWS_STORAGE_KEY,
      JSON.stringify([...new Set(ids.filter(isValidId))].slice(0, GUEST_VIEW_LIMIT)),
    );
  } catch {
    // Private mode / quota — ignore; server cookie still enforces the limit.
  }
};

export const markGuestViewLimitReached = () => {
  try {
    window.localStorage.setItem(LIMIT_FLAG_KEY, '1');
  } catch {
    // ignore
  }
};

export const hasReachedGuestViewLimit = (viewedIds = readGuestViewedIds()) => {
  try {
    if (window.localStorage.getItem(LIMIT_FLAG_KEY) === '1') return true;
  } catch {
    // ignore
  }
  return viewedIds.length >= GUEST_VIEW_LIMIT;
};

export const canGuestViewPost = (postId, viewedIds = readGuestViewedIds()) => {
  if (!postId) return false;
  if (viewedIds.includes(postId)) return true;
  return !hasReachedGuestViewLimit(viewedIds);
};

/** Records a unique post view. Returns the updated id list. */
export const recordGuestPostView = (postId) => {
  const viewed = readGuestViewedIds();
  if (!postId || viewed.includes(postId)) return viewed;
  if (hasReachedGuestViewLimit(viewed)) return viewed;
  const next = [...viewed, postId];
  writeGuestViewedIds(next);
  if (next.length >= GUEST_VIEW_LIMIT) markGuestViewLimitReached();
  return next;
};

export const isGuestViewLimitError = (error) => {
  const details =
    error?.details ||
    error?.response?.data?.error?.details ||
    error?.raw?.response?.data?.error?.details;
  return error?.status === 403 && details?.reason === 'GUEST_VIEW_LIMIT';
};
