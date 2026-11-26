import { Link } from 'react-router';
import Container from '@/components/ui/Container';
import { JOIN_PATH } from '../constant/constants';
import CategoryPills from './CategoryPills';

/** Page hero for the public General posts list. */
const PublicGeneralHero = ({
  isAuthenticated = false,
  category,
  onCategoryChange,
}) => (
  <section className="relative isolate overflow-hidden border-b border-slate-200/70 bg-slate-50">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
    />

    <Container className="relative">
      <div className="flex flex-col items-start gap-8 py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Community
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-[-0.025em] text-deep-blue sm:text-5xl">
            General posts
          </h1>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-[16px]">
            {isAuthenticated ? (
              'Browse the latest news and documents shared by the Lab Unity community.'
            ) : (
              <>
                Preview the latest news and documents from the Lab Unity community.{' '}
                <Link
                  to={JOIN_PATH}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Sign up
                </Link>{' '}
                free to unlock the full library.
              </>
            )}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate-400">
            Filter
          </p>
          <CategoryPills value={category} onChange={onCategoryChange} />
        </div>
      </div>
    </Container>
  </section>
);

export default PublicGeneralHero;
