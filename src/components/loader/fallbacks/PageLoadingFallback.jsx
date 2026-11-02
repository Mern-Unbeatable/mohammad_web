/** Reusable route/page loading UI for Suspense fallbacks. */
const PageLoadingFallback = ({ label = "Loading page" }) => (
  <div
    className="page-loading-fallback flex min-h-[40vh] flex-col items-center justify-center px-4 py-10"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="flex w-full max-w-[280px] flex-col items-center gap-5">
      <div className="page-loader text-primary" aria-hidden />

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
