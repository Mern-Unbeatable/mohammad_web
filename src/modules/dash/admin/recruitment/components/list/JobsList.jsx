import { CardSkeleton } from "@/components/loader";
import JobCard from "@/components/data-display/JobCard/JobCard";
import { JOB_SKELETON_COUNT, jobDetailPath } from "../../constant/constants";

/** Skeletons on first load, an empty message, or the admin job cards. */
const JobsList = ({ items, loading, deleting, onDelete }) => {
  if (loading) {
    return <CardSkeleton variant="job" count={JOB_SKELETON_COUNT} className="space-y-3" />;
  }

  if (!items.length) {
    return (
      <p className="py-16 text-center text-sm text-[#64748B]">
        No job listings found for these filters.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          variant="admin"
          detailHref={jobDetailPath(job.id)}
          onDelete={deleting ? undefined : onDelete}
        />
      ))}
    </div>
  );
};

export default JobsList;
