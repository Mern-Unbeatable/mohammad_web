import { Link } from "react-router";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { JOIN_PATH, LOGIN_PATH } from "../constant/constants";

/** Static “Load more” CTA for guests. Sign-in card stays below. */
const GuestLoadMore = () => (
  <div className="relative mt-12">
    {/* Fade mask — implies content continues below */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-white to-transparent"
    />

    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-700 via-slate-900 to-slate-800">
      {/* Diagonal accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
        {/* Left: message */}
        <div className="flex items-start gap-4">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80">
            <LockKeyhole
              className="h-4 w-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-white">
              Free preview ends here
            </p>
            <p className="mt-1 max-w-sm text-[13.5px] leading-relaxed text-slate-400">
              Join Lab Unity to keep browsing the full library of posts and
              documents.
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 sm:shrink-0">
          <Link
            to={LOGIN_PATH}
            className="text-[13.5px] font-medium text-slate-400 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <span aria-hidden="true" className="h-4 w-px bg-white/15" />
          <Link
            to={JOIN_PATH}
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13.5px] font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Load more
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default GuestLoadMore;
