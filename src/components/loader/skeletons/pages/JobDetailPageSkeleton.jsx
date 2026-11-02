import JobPosterCardSkeleton from '@/components/loader/skeletons/cards/JobPosterCardSkeleton';
import JobDetailSkeleton from '@/components/loader/skeletons/pages/JobDetailSkeleton';

/**
 * Full job detail page: job card on the left, "Posted by" on the right.
 * Render inside the same grid container as JobDetailView.
 */
const JobDetailPageSkeleton = () => (
  <>
    <div className="min-w-0">
      <JobDetailSkeleton />
    </div>
    <aside className="mt-8 lg:mt-10" aria-busy="true" aria-live="polite">
      <JobPosterCardSkeleton />
    </aside>
  </>
);

export default JobDetailPageSkeleton;
