import { Loader2 } from "lucide-react";

/**
 * Reusable route/page loading UI for Suspense fallbacks.
 * Uses project colors + lucide-react (same stack as Login/Admin loaders).
 */
const PageLoadingFallback = ({ label = "Loading page" }) => (
  <div
    className="page-loading-fallback flex min-h-[40vh] flex-col items-center justify-center px-4 py-10"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="flex w-full max-w-[280px] flex-col items-center gap-5">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full bg-secondary opacity-80 animate-pulse"
          aria-hidden
        />
        <Loader2
          className="relative h-6 w-6 animate-spin text-primary"
          strokeWidth={2}
        />
      </div>

      <div className="text-center">
        <p className="text-[14px] font-medium text-deep-blue">
          {label}
          <span className="page-loading-dots" aria-hidden>
            ...
          </span>
        </p>
      </div>
    </div>
  </div>
);

export default PageLoadingFallback;
