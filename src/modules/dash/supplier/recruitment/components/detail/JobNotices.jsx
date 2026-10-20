import { jobClosedNotice } from "@/features/recruitment/jobStatus";

/** "Job closed" note and the confirmation right after applying. */
const JobNotices = ({ status, isOpen, isOwner, justApplied }) => (
  <>
    {!isOpen ? (
      <p className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#475467]">
        {jobClosedNotice(status, isOwner)}
      </p>
    ) : null}

    {justApplied ? (
      <p className="text-[14px] font-medium text-green-primary">
        Your application has been submitted.
      </p>
    ) : null}
  </>
);

export default JobNotices;
