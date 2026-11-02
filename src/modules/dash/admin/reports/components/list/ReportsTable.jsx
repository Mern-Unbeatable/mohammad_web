import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import ReportedUserCell from "./ReportedUserCell";
import { REPORTS_PAGE_SIZE, STATUS_FILTER_OPTIONS } from "../../constant/constants";

const COLUMNS = [
  { key: "reportedBy", header: "Reported By", className: "font-semibold" },
  {
    key: "reportedItem",
    header: "Reported Item",
    render: (value) => (
      <span className="block max-w-[250px] truncate" title={value || undefined}>
        {value}
      </span>
    ),
  },
  { key: "type", header: "Type" },
  { key: "reason", header: "Reason" },
  {
    key: "reportedUser",
    header: "Reported User",
    render: (_, row) => <ReportedUserCell row={row} />,
  },
  { key: "reportedDate", header: "Reported Date" },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} label={value} />,
  },
];

/** DataTable with search, status filter, row actions and pagination. */
const ReportsTable = ({
  rows,
  loading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  rowActions,
  page,
  total,
  onPageChange,
}) => (
  <DataTable
    showSearch
    searchValue={search}
    onSearchChange={onSearchChange}
    searchPlaceholder="Search reports..."
    showFilters
    filterLabel=""
    filters={[
      {
        id: "status",
        value: statusFilter,
        options: STATUS_FILTER_OPTIONS,
        onChange: onStatusFilterChange,
      },
    ]}
    columns={COLUMNS}
    data={rows}
    loading={loading}
    showActions
    getActions={rowActions}
    showPagination
    pagination={{ page, pageSize: REPORTS_PAGE_SIZE, total, onPageChange }}
    tableMinWidth="1100px"
  />
);

export default ReportsTable;
