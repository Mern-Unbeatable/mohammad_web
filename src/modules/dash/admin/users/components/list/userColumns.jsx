import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import SubscriptionPill from "./SubscriptionPill";

/** Users table columns; the subscription column is hidden on the supplier tab. */
export const getUserColumns = (isSupplierTab) => [
  {
    key: "userName",
    header: "User Name",
    className: "font-semibold",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatar} alt={value} size="sm" />
        <span className="truncate">{value}</span>
      </div>
    ),
  },
  { key: "userType", header: "User Type" },
  { key: "company", header: "Company/Organization" },
  { key: "role", header: "Role" },
  ...(isSupplierTab
    ? []
    : [
        {
          key: "subscription",
          header: "Subscription",
          render: (value) => <SubscriptionPill label={value} />,
        },
      ]),
  { key: "joinedDate", header: "Joined Date" },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];
