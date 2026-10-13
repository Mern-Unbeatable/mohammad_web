import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CheckCircle2, Clock, Shield } from "lucide-react";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import StatCard from "@/components/data-display/StatCard/StatCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  fetchReportsList,
  fetchReportStats,
  updateReportStatus,
} from "@/features/admin/reports";
import {
  statusFilterToApi,
  statusLabelToApi,
  toReportRowModel,
  toStatCards,
} from "@/features/admin/reports/reportsMappers";

const PAGE_SIZE = 10;

const REPORT_ICONS = {
  total: Shield,
  pending: Clock,
  review: Clock,
  resolved: CheckCircle2,
};

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

const buildReportsQuery = ({ page, statusFilter, search }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
  };

  const status = statusFilterToApi(statusFilter);
  if (status) params.status = status;

  const q = search?.trim();
  if (q) params.search = q;

  return params;
};

const AdminReportsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports, reportsMeta, stats, reportsLoading, statsLoading, error } =
    useSelector((state) => state.adminReports);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    dispatch(fetchReportStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchReportsList(
        buildReportsQuery({
          page,
          statusFilter,
          search: debouncedSearch,
        }),
      ),
    );
  }, [dispatch, page, statusFilter, debouncedSearch]);

  const tableRows = useMemo(
    () => (reports || []).map(toReportRowModel).filter(Boolean),
    [reports],
  );

  const statCards = useMemo(() => toStatCards(stats), [stats]);

  const handleStatusChange = async (reportId, label) => {
    const apiStatus = statusLabelToApi(label);
    if (!apiStatus) return;

    const result = await dispatch(
      updateReportStatus({ reportId, status: apiStatus }),
    );

    if (updateReportStatus.fulfilled.match(result)) {
      toast.success(`Status set to ${label}`);
      dispatch(fetchReportStats());
      return;
    }
    toast.error(result.payload || "Failed to update status");
  };

  const columns = useMemo(
    () => [
      { key: "reportedBy", header: "Reported By", className: "font-semibold" },
      {
        key: "reportedItem",
        header: "Reported Item",
        wrap: true,
        className: "max-w-[220px]",
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
    ],
    [],
  );

  const rowActions = (row) => [
    {
      id: "details",
      label: "See Details",
      onClick: () => navigate(`/admin/reports/${row.id}`),
    },
    {
      id: "pending",
      label: "Pending",
      disabled: () => row.status === "Pending",
      onClick: () => handleStatusChange(row.id, "Pending"),
    },
    {
      id: "review",
      label: "Under Review",
      disabled: () => row.status === "Under Review",
      onClick: () => handleStatusChange(row.id, "Under Review"),
    },
    {
      id: "resolved",
      label: "Resolved",
      disabled: () => row.status === "Resolved",
      onClick: () => handleStatusChange(row.id, "Resolved"),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Reports & Moderation"
        subtitle="Review reported content and users, take appropriate action, and manage moderation cases across the Lab Unity healthcare and diagnostic network."
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {statsLoading && !statCards.length ? (
        <CardSkeleton
          variant="statCard"
          count={4}
          className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4"
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.id} icon={REPORT_ICONS[stat.id]} {...stat} />
          ))}
        </div>
      )}

      <DataTable
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        searchPlaceholder="Search reports..."
        showFilters
        filterLabel=""
        filters={[
          {
            id: "status",
            value: statusFilter,
            options: [
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "under review", label: "Under Review" },
              { value: "resolved", label: "Resolved" },
            ],
            onChange: (value) => {
              setStatusFilter(value);
            },
          },
        ]}
        columns={columns}
        data={tableRows}
        loading={reportsLoading}
        showActions
        getActions={rowActions}
        showPagination
        pagination={{
          page: reportsMeta?.page || page,
          pageSize: PAGE_SIZE,
          total: reportsMeta?.total || 0,
          onPageChange: setPage,
        }}
        tableMinWidth="1100px"
      />
    </PanelPage>
  );
};

export default AdminReportsView;
