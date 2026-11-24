import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import { roleLabel } from "@/shared/constants/roles";
import SubscriptionPill from "./SubscriptionPill";

/** Users table columns; the subscription column is hidden on the supplier tab. */
export const getUserColumns = (isSupplierTab) => [
  {
    key: "userName",
    header: "User Name",
    render: (value, row) => (
      <div className="flex items-center gap-2.5">
        <Avatar src={row.avatar} alt={value} size="sm" className="!h-8 !w-8 shrink-0" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-semibold text-deep-blue">{value}</p>
          <p className="truncate text-[11px] text-[#64748B]">{roleLabel(row.role)}</p>
        </div>
      </div>
    ),
  },
  ...(isSupplierTab
    ? []
    : [
        {
          key: "subscription",
          header: "Subscription",
          render: (value) => <SubscriptionPill label={value} />,
        },
      ]),
  { key: "userType", header: "User Type" },
  { key: "company", header: "Company/Organization" },
  { key: "joinedDate", header: "Joined Date" },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];
