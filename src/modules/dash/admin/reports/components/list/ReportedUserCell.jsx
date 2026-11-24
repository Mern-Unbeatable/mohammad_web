import Avatar from "@/components/ui/Avatar";

/** Reported user's name with avatar and a warnings pill when they have any. */
const ReportedUserCell = ({ row }) => (
  <div className="flex items-center gap-2.5">
    <Avatar
      src={row.reportedUserAvatar}
      alt={row.reportedUser}
      initials={row.reportedUserInitials}
      size="sm"
      className="!h-8 !w-8 shrink-0"
    />
    <div className="min-w-0">
      <p className="truncate font-medium text-deep-blue">{row.reportedUser}</p>
      {row.reportCount > 0 ? (
        <span className="mt-0.5 inline-flex rounded-md bg-pink-secondary px-2 py-0.5 text-[11px] font-semibold text-pink-light">
          {row.reportCount} Warnings
        </span>
      ) : null}
    </div>
  </div>
);

export default ReportedUserCell;
