import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import CategoryPill from "@/components/data-display/CategoryPill/CategoryPill";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import ReasonModal from "@/modules/dash/admin/components/ReasonModal";
import {
  fetchAdsList,
  reviewAdvertisement,
} from "@/features/admin/advertisements";
import {
  statusFilterToApi,
  statusLabelToReviewApi,
  toAdRowModel,
} from "@/features/admin/advertisements/adsMappers";

const PAGE_SIZE = 10;

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const buildAdsQuery = ({ page, statusFilter, search }) => {
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

const AdminAdvertisementView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ads, adsMeta, adsLoading, actionLoading, error } = useSelector(
    (state) => state.adminAds,
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    dispatch(
      fetchAdsList(
        buildAdsQuery({
          page,
          statusFilter,
          search: debouncedSearch,
        }),
      ),
    );
  }, [dispatch, page, statusFilter, debouncedSearch]);

  const tableRows = useMemo(
    () => (ads || []).map(toAdRowModel).filter(Boolean),
    [ads],
  );

  const handleReview = async (adId, label, rejectionReason) => {
    const apiStatus = statusLabelToReviewApi(label);
    if (!apiStatus) {
      toast("Pending is the default submission state and cannot be set by review.");
      return;
    }

    const result = await dispatch(
      reviewAdvertisement({
        adId,
        status: apiStatus,
        rejectionReason,
      }),
    );

    if (reviewAdvertisement.fulfilled.match(result)) {
      toast.success(`Advertisement marked ${label}`);
      return;
    }
    toast.error(result.payload || "Failed to update advertisement");
  };

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Advertisement",
        render: (_, row) => <AdCell row={row} />,
      },
      {
        key: "status",
        header: "Status",
        render: (value) => <StatusBadge status={value} label={value} />,
      },
      { key: "views", header: "Views" },
      { key: "clicks", header: "Clicks" },
      { key: "duration", header: "Duration" },
      { key: "uploadDate", header: "Upload date" },
    ],
    [],
  );

  const rowActions = (row) => [
    {
      id: "details",
      label: "See Details",
      onClick: () => navigate(`/admin/advertisement/${row.id}`),
    },
    {
      id: "active",
      label: "Active",
      disabled: () => row.status === "Active" || actionLoading,
      onClick: () => handleReview(row.id, "Active"),
    },
    {
      id: "expired",
      label: "Expired",
      disabled: () => row.status === "Expired" || actionLoading,
      onClick: () => handleReview(row.id, "Expired"),
    },
    {
      id: "rejected",
      label: "Rejected",
      variant: "danger",
      disabled: () => row.status === "Rejected" || actionLoading,
      onClick: () => setRejectTarget(row),
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Advertisement"
        subtitle="Manage advertisement post"
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <DataTable
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search advertisements..."
        showFilters
        filterLabel="Sort by:"
        filters={[
          {
            id: "status",
            value: statusFilter,
            options: [
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "expired", label: "Expired" },
              { value: "rejected", label: "Rejected" },
            ],
            onChange: setStatusFilter,
          },
        ]}
        columns={columns}
        data={tableRows}
        loading={adsLoading}
        showActions
        getActions={rowActions}
        showPagination
        pagination={{
          page: adsMeta?.page || page,
          pageSize: PAGE_SIZE,
          total: adsMeta?.total || 0,
          onPageChange: setPage,
        }}
        tableMinWidth="1000px"
      />

      <ReasonModal
        open={Boolean(rejectTarget)}
        title="Reject advertisement"
        submitLabel="Reject"
        placeholder="Why reject this advertisement?"
        description={
          rejectTarget
            ? `Rejecting "${rejectTarget.title}" will remove it from active promotion.`
            : undefined
        }
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget) {
            handleReview(rejectTarget.id, "Rejected", reason);
          }
        }}
      />
    </PanelPage>
  );
};

export default AdminAdvertisementView;
