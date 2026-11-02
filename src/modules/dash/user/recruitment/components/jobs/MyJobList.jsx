import { useNavigate } from "react-router";
import { CardSkeleton } from "@/components/loader";
import JobCard from "@/components/data-display/JobCard/JobCard";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";
import { editJobPath, jobDetailPath } from "../../constant/constants";

/** Loading / empty states and the owner's job cards with edit, close and delete. */
const MyJobList = ({
  items,
  page,
  loading,
  unfiltered,
  newApplicationsByJob,
  deleting,
  togglingId,
  onToggleStatus,
  onDelete,
  jobHref = jobDetailPath,
  editHref = editJobPath,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <CardSkeleton variant="myJob" count={LIST_PAGE_SIZE} className="space-y-4" />;
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
        <p className="text-[15px] font-semibold text-deep-blue">
          {unfiltered ? "No job posts yet" : "No job posts match these filters"}
        </p>
        <p className="mt-2 text-[14px] text-[#64748B]">
          {unfiltered
            ? "Post your first role to reach qualified laboratory professionals."
            : "Try a different search or status."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((job, index) => (
        <JobCard
          key={job.id}
          job={job}
          variant="mine"
          highlighted={index === 0 && page === 1}
          detailHref={jobHref(job.id)}
          onDelete={deleting ? undefined : onDelete}
          onEdit={() => navigate(editHref(job.id))}
          onToggleStatus={onToggleStatus}
          togglingStatus={togglingId === job.id}
          newApplications={newApplicationsByJob[job.id] || 0}
        />
      ))}
    </div>
  );
};

export default MyJobList;
