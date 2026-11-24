import Avatar from "@/components/ui/Avatar";

/** Reporter name with avatar. */
const ReportedByCell = ({ row }) => (
  <div className="flex items-center gap-2.5">
    <Avatar
      src={row.reporterAvatar}
      alt={row.reportedBy}
      initials={row.reporterInitials}
      size="sm"
      className="!h-8 !w-8 shrink-0"
    />
    <span className="truncate font-semibold text-deep-blue">{row.reportedBy}</span>
  </div>
);

export default ReportedByCell;
