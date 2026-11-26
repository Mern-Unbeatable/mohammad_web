import { Link } from 'react-router';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { JOIN_PATH, LOGIN_PATH } from '../constant/constants';

/** Static “Load more” CTA for guests. Sign-in card stays below. */
const GuestLoadMore = () => (
  <div className="relative mt-8 sm:mt-12">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-[#F7F8FA] to-transparent sm:-top-20 sm:h-20"
    />

    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-700 via-slate-900 to-slate-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 sm:h-10 sm:w-10">
            <LockKeyhole className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white sm:text-[15px]">
              Free preview ends here
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-400 sm:max-w-sm sm:text-[13.5px]">
              Join Lab Unity to keep browsing the full library of posts and documents.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col-reverse gap-2.5 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:gap-3">
          <Link
            to={LOGIN_PATH}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/15 text-[13.5px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:h-auto sm:w-auto sm:border-0 sm:px-0 sm:py-0"
          >
            Log in
          </Link>
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-white/15 sm:block"
          />
          <Link
            to={JOIN_PATH}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 text-[13.5px] font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:h-auto sm:w-auto sm:py-2.5"
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
