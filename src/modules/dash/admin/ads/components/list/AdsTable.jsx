import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import AdCell from "./AdCell";
import { ADS_PAGE_SIZE, STATUS_FILTER_OPTIONS } from "../../constant/constants";

const COLUMNS = [
  { key: "title", header: "Advertisement", render: (_, row) => <AdCell row={row} /> },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} label={value} />,
  },
  { key: "views", header: "Views" },
  { key: "clicks", header: "Clicks" },
  { key: "duration", header: "Duration" },
  { key: "uploadDate", header: "Upload date" },
];

/** Search, status filter, ads table with review row actions, and pagination. */
const AdsTable = ({
  rows,
  loading,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  rowActions,
  page,
  total,
  onPageChange,
}) => (
  <DataTable
    showSearch
    searchValue={search}
    onSearchChange={onSearchChange}
    searchPlaceholder="Search advertisements..."
    showFilters
    filterLabel="Sort by:"
    filters={[
      { id: "status", value: statusFilter, options: STATUS_FILTER_OPTIONS, onChange: onStatusChange },
    ]}
    columns={COLUMNS}
    data={rows}
    loading={loading}
    showActions
    getActions={rowActions}
    showPagination
    pagination={{ page, pageSize: ADS_PAGE_SIZE, total, onPageChange }}
    tableMinWidth="1000px"
  />
);

export default AdsTable;
