/**
 * Recovery from "stale build" errors. After a deploy the old page still
 * references the previous build's hashed chunks (e.g. AdminDashboardView-C1K4JgKt.js),
 * which no longer exist, so lazy imports fail. Reloading fetches the new
 * index.html and its new chunk names. A short guard prevents reload loops if
 * the failure is something else (offline, server down).
 */

const RELOAD_KEY = 'labunity:chunk-reload-at';
const RELOAD_GUARD_MS = 10_000;

const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i, // Chrome, Edge
  /error loading dynamically imported module/i, // Firefox
  /Importing a module script failed/i, // Safari
  /Unable to preload CSS/i, // Vite CSS preload
  /Loading (CSS )?chunk [\w-]+ failed/i,
  /is not a valid JavaScript MIME type/i,
];

export function isChunkLoadError(error) {
  const message = String(error?.message ?? error ?? '');
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

/** Reload the page unless we already did so moments ago. Returns whether it reloads. */
export function reloadForNewBuild() {
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_GUARD_MS) return false;
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked: still reload once; the browser won't loop on a single error.
  }
  window.location.reload();
  return true;
}

/** Wrap a dynamic import so a stale-build failure reloads instead of erroring. */
export function withChunkReload(factory) {
  return () =>
    factory().catch((error) => {
      if (isChunkLoadError(error) && reloadForNewBuild()) {
        // Keep the loading fallback on screen while the page reloads.
        return new Promise(() => {});
      }
      throw error;
    });
}

/** Vite fires this when a preload (JS/CSS) for a lazy chunk fails. */
export function installPreloadErrorReload() {
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadForNewBuild()) event.preventDefault();
  });
}
