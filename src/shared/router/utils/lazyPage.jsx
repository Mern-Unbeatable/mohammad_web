import { Suspense, lazy } from "react";
import PageLoadingFallback from "@/components/loader/fallbacks/PageLoadingFallback";
import { withChunkReload } from "./chunkReload";

/**
 * Wraps a dynamic import in React.lazy + Suspense for route elements.
 * After a deploy, a chunk from the old build is gone; the page then reloads
 * once to pick up the new build instead of showing an error.
 * @param {() => Promise<{ default: React.ComponentType }>} factory
 */
export function lazyPage(factory) {
  const Component = lazy(withChunkReload(factory));

  return function LazyRoutePage(props) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
