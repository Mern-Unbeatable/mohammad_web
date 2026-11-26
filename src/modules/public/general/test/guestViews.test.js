import { beforeEach, describe, expect, it } from 'vitest';
import {
  canGuestViewPost,
  hasReachedGuestViewLimit,
  markGuestViewLimitReached,
  readGuestViewedIds,
  recordGuestPostView,
} from '../utils/guestViews';
import { GUEST_VIEW_LIMIT, GUEST_VIEWS_STORAGE_KEY } from '../constant/constants';

const memoryStore = new Map();

beforeEach(() => {
  memoryStore.clear();
  globalThis.window = {
    localStorage: {
      getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
      setItem: (key, value) => {
        memoryStore.set(key, String(value));
      },
      clear: () => memoryStore.clear(),
    },
  };
});

describe('guestViews', () => {
  it('records unique post ids and ignores revisits', () => {
    recordGuestPostView('a');
    recordGuestPostView('a');
    recordGuestPostView('b');
    expect(readGuestViewedIds()).toEqual(['a', 'b']);
    expect(canGuestViewPost('a')).toBe(true);
  });

  it('blocks new posts after the guest limit', () => {
    for (let i = 0; i < GUEST_VIEW_LIMIT; i += 1) {
      recordGuestPostView(`post-${i}`);
    }
    expect(hasReachedGuestViewLimit()).toBe(true);
    expect(canGuestViewPost('fresh-post')).toBe(false);
    expect(canGuestViewPost('post-0')).toBe(true);
    expect(window.localStorage.getItem(GUEST_VIEWS_STORAGE_KEY)).toBeTruthy();
  });

  it('persists an explicit limit flag across refreshes', () => {
    markGuestViewLimitReached();
    expect(hasReachedGuestViewLimit()).toBe(true);
    expect(canGuestViewPost('anything')).toBe(false);
  });
});
