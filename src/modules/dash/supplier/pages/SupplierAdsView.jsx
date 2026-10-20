import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import CategoryPill from "@/components/data-display/CategoryPill/CategoryPill";
import Card from "@/components/ui/Card";
import CreateAdModal from "@/modules/dash/supplier/components/CreateAdModal";
import {
  fetchSupplierAds,
  clearSupplierAdsError,
  statusFilterToApi,
  toAdRowModel,
} from "@/features/dash/supplier/advertisements";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import { panelPrimaryBtn } from "@/components/navigation/panel/panelPageTheme";

const PAGE_SIZE = 7;

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const buildAdsQuery = ({ page, statusFilter, sortFilter, search }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
    sort: sortFilter === "oldest" ? "asc" : "desc",
    mine: true,
  };

  const status = statusFilterToApi(statusFilter);
  if (status) params.status = status;

  const q = search?.trim();
  if (q) params.search = q;

  return params;
};

const SupplierAdsView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ads, adsMeta, adsLoading, error } = useSelector(
    (state) => state.supplierAds,
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [resubmitAdId, setResubmitAdId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortFilter]);

  useEffect(() => {
    dispatch(clearSupplierAdsError());
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({
          page,
          statusFilter,
          sortFilter,
          search: debouncedSearch,
        }),
      ),
    );
  }, [dispatch, page, statusFilter, sortFilter, debouncedSearch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const tableRows = useMemo(
    () => (ads || []).map(toAdRowModel).filter(Boolean),
    [ads],
  );

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

  const openCreate = (adId = null) => {
    setResubmitAdId(adId);
    setCreateOpen(true);
  };

  const rowActions = (row) => {
    const actions = [
      {
        id: "details",
        label: "See Details",
        onClick: () => navigate(`/supplier/ads/${row.id}`),
      },
    ];

    if (row.status === "Rejected") {
      actions.push({
        id: "resubmit",
        label: "Resubmit",
        onClick: () => openCreate(row.id),
      });
    }

    if (row.status === "Expired") {
      actions.push({
        id: "renew",
        label: "Renew",
        onClick: () => openCreate(null),
      });
    }

    return actions;
  };

  const handleCreated = () => {
    setPage(1);
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({
          page: 1,
          statusFilter,
          sortFilter,
          search: debouncedSearch,
        }),
      ),
    );
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="My Advertisement"
        subtitle="Create and manage your ads on here"
        action={
          <button
            type="button"
            onClick={() => openCreate(null)}
            className={panelPrimaryBtn}
          >
            Create a advertisement
          </button>
        }
      />

      <Card className="overflow-hidden p-4 sm:p-5">
        <DataTable
          showCard={false}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
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
              onChange: (value) => {
                setStatusFilter(value);
                setPage(1);
              },
            },
            {
              id: "sort",
              value: sortFilter,
              options: [
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ],
              onChange: (value) => {
                setSortFilter(value);
                setPage(1);
              },
            },
          ]}
          columns={columns}
          data={tableRows}
          loading={adsLoading}
          showActions
          getActions={rowActions}
          showPagination
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: adsMeta?.total || 0,
            onPageChange: setPage,
          }}
          tableMinWidth="900px"
        />
      </Card>

      <CreateAdModal
        key={createOpen ? resubmitAdId || "new" : "closed"}
        open={createOpen}
        editAdId={resubmitAdId}
        initialAd={
          resubmitAdId
            ? (ads || []).find((ad) => ad.id === resubmitAdId) || null
            : null
        }
        onClose={() => {
          setCreateOpen(false);
          setResubmitAdId(null);
        }}
        onCreated={handleCreated}
      />
    </PanelPage>
  );
};

export default SupplierAdsView;
