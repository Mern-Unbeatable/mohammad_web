import { CardSkeleton } from "@/components/loader";
import JobCard from "@/components/data-display/JobCard/JobCard";
import { PUBLIC_JOBS_PAGE_SIZE, VIEW_MODE, jobDetailPath } from "../../constant/constants";

const LAYOUT_CLASS = {
  [VIEW_MODE.GRID]: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
  [VIEW_MODE.LIST]: "space-y-4",
};

/** Loading / error / empty states and the public job cards in list or grid layout. */
const PublicJobList = ({
  items,
  page,
  viewMode,
  loading,
  error,
  onRetry,
  jobHref = jobDetailPath,
}) => {
  const layoutClass = LAYOUT_CLASS[viewMode] || LAYOUT_CLASS[VIEW_MODE.LIST];

  if (loading) {
    return (
      <CardSkeleton
        variant={viewMode === VIEW_MODE.GRID ? "jobGrid" : "job"}
        count={PUBLIC_JOBS_PAGE_SIZE}
        className={layoutClass}
      />
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
        <p className="text-[15px] font-semibold text-deep-blue">Couldn&apos;t load jobs</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-[14px] font-semibold text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
        <p className="text-[15px] font-semibold text-deep-blue">No jobs found</p>
        <p className="mt-2 text-[14px] text-[#64748B]">Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div className={layoutClass}>
      {items.map((job, index) => (
        <JobCard
          key={job.id}
          job={job}
          layout={viewMode}
          highlighted={index === 0 && page === 1}
          detailHref={jobHref(job.id)}
        />
      ))}
    </div>
  );
};

export default PublicJobList;
