/** Reported user's name with a warnings pill when they have any. */
const ReportedUserCell = ({ row }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="font-medium text-deep-blue">{row.reportedUser}</span>
    {row.reportCount > 0 ? (
      <span className="inline-flex rounded-md bg-pink-secondary px-2 py-0.5 text-[11px] font-semibold text-pink-light sm:text-[12px] lg:text-[13px]">
        {row.reportCount} Warnings
      </span>
    ) : null}
  </div>
);

export default ReportedUserCell;
