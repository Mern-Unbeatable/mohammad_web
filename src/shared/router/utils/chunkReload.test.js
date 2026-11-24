import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isChunkLoadError, reloadForNewBuild, withChunkReload } from './chunkReload';

let storage;
let reload;

beforeEach(() => {
  storage = new Map();
  reload = vi.fn();
  vi.stubGlobal('window', {
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    location: { reload },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('isChunkLoadError', () => {
  it('recognises stale-chunk errors from each browser', () => {
    expect(
      isChunkLoadError(
        new TypeError(
          'Failed to fetch dynamically imported module: https://labunity.be/assets/AdminDashboardView-C1K4JgKt.js',
        ),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module'))).toBe(true);
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
  });

  it('ignores ordinary errors', () => {
    expect(isChunkLoadError(new Error('Network Error'))).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});

describe('reloadForNewBuild', () => {
  it('reloads once, then refuses within the guard window to avoid loops', () => {
    expect(reloadForNewBuild()).toBe(true);
    expect(reloadForNewBuild()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads again once the guard window has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-11T10:00:00Z'));
    reloadForNewBuild();
    vi.setSystemTime(new Date('2026-11-11T10:00:30Z'));
    expect(reloadForNewBuild()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });
});

describe('withChunkReload', () => {
  it('passes a successful import through', async () => {
    const mod = { default: () => null };
    await expect(withChunkReload(() => Promise.resolve(mod))()).resolves.toBe(mod);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads on a stale chunk instead of rejecting', async () => {
    const pending = withChunkReload(() =>
      Promise.reject(new TypeError('Failed to fetch dynamically imported module: x.js')),
    )();
    const outcome = await Promise.race([
      pending.then(() => 'resolved', () => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 20)),
    ]);
    expect(outcome).toBe('pending');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('rethrows other errors, and stale chunks once the guard has fired', async () => {
    await expect(withChunkReload(() => Promise.reject(new Error('boom')))()).rejects.toThrow('boom');

    reloadForNewBuild();
    await expect(
      withChunkReload(() => Promise.reject(new TypeError('Failed to fetch dynamically imported module')))(),
    ).rejects.toThrow('Failed to fetch');
  });
});
