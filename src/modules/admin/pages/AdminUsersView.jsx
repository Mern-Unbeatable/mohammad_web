import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import SuspendUserModal from "@/modules/admin/components/SuspendUserModal";
import SubscriptionPill from "@/modules/admin/components/SubscriptionPill";
import { fetchUsersList, updateUserStatus } from "@/features/admin/users";

const PAGE_SIZE = 10;

const USER_TABS = [
  { id: "all", label: "All Users" },
  { id: "user", label: "Users" },
  { id: "supplier", label: "Supplier" },
];

/** Build list query matching server adminUserListQuerySchema */
const buildUsersQuery = ({ page, tab, statusFilter, planFilter, search }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
  };

  if (tab === "supplier") params.role = "supplier";
  else if (tab === "user") params.role = "user";

  if (statusFilter === "active") params.status = "active";
  else if (statusFilter === "suspend") params.status = "suspended";
  else if (statusFilter === "banned") params.status = "banned";

  if (planFilter !== "all") params.plan = planFilter;

  const q = search?.trim();
  if (q) params.search = q;

  return params;
};

const AdminUsersView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, usersMeta, usersLoading, error } = useSelector(
    (state) => state.adminUsers,
  );

  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suspendTarget, setSuspendTarget] = useState(null);

  const isSupplierTab = tab === "supplier";

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      fetchUsersList(
        buildUsersQuery({
          page,
          tab,
          statusFilter,
          planFilter,
          search: debouncedSearch,
        }),
      ),
    );
  }, [dispatch, page, tab, statusFilter, planFilter, debouncedSearch]);

  const tableRows = useMemo(() => {
    if (!users?.length) return [];

    return users.map((u) => {
      const rawName =
        u.profile?.name ||
        [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") ||
        u.email;

      const rawPlan = u.subscription?.plan || "FREE";
      const planCapitalized =
        String(rawPlan).charAt(0).toUpperCase() +
        String(rawPlan).slice(1).toLowerCase();

      const rawStatus =
        u.status === "SUSPENDED"
          ? "Suspend"
          : u.status === "BANNED"
            ? "Banned"
            : "Active";

      return {
        id: u.id,
        userName: rawName,
        userType: u.profileType || u.profile?.title || "Laboratory",
        company: u.profile?.company || u.profile?.country || "N/A",
        role: u.role || "USER",
        subscription: planCapitalized,
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        status: rawStatus,
      };
    });
  }, [users]);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setPage(1);
    setPlanFilter("all");
    setStatusFilter("all");
  };

  const refetch = () => {
    dispatch(
      fetchUsersList(
        buildUsersQuery({
          page,
          tab,
          statusFilter,
          planFilter,
          search: debouncedSearch,
        }),
      ),
    );
  };

  const handleStatusChange = async (userId, newStatus, reason = "") => {
    const apiStatus = newStatus === "Suspend" ? "SUSPENDED" : "ACTIVE";
    const statusReason =
      reason?.trim() ||
      (apiStatus === "SUSPENDED" ? undefined : "Account activated by admin");

    const resultAction = await dispatch(
      updateUserStatus({ userId, status: apiStatus, reason: statusReason }),
    );

    if (updateUserStatus.fulfilled.match(resultAction)) {
      toast.success(
        newStatus === "Suspend"
          ? "User suspended successfully"
          : "User activated successfully",
      );
      refetch();
    } else {
      toast.error(resultAction.payload || "Failed to update user status");
    }
  };

  const userColumns = useMemo(() => {
    const base = [
      { key: "userName", header: "User Name", className: "font-semibold" },
      { key: "userType", header: "User Type" },
      { key: "company", header: "Company/Organization" },
      { key: "role", header: "Role" },
    ];

    if (!isSupplierTab) {
      base.push({
        key: "subscription",
        header: "Subscription",
        render: (value) => <SubscriptionPill label={value} />,
      });
    }

    base.push(
      { key: "joinedDate", header: "Joined Date" },
      {
        key: "status",
        header: "Status",
        render: (value) => <StatusBadge status={value} />,
      },
    );

    return base;
  }, [isSupplierTab]);

  const rowActions = (row) => [
    {
      id: "details",
      label: "See Details",
      onClick: () => navigate(`/admin/users/${row.id}`),
    },
    {
      id: "active",
      label: "Active",
      disabled: () => row.status === "Active",
      onClick: () => handleStatusChange(row.id, "Active"),
    },
    {
      id: "suspend",
      label: "Suspend",
      variant: "danger",
      disabled: () => row.status === "Suspend" || row.status === "Banned",
      onClick: () => setSuspendTarget(row),
    },
  ];

  const filters = [
    ...(isSupplierTab
      ? []
      : [
          {
            id: "subscription",
            value: planFilter,
            options: [
              { value: "all", label: "All Subscription" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
              { value: "free", label: "Free" },
            ],
            onChange: (value) => {
              setPlanFilter(value);
              setPage(1);
            },
          },
        ]),
    {
      id: "status",
      value: statusFilter,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "suspend", label: "Suspended" },
        { value: "banned", label: "Banned" },
      ],
      onChange: (value) => {
        setStatusFilter(value);
        setPage(1);
      },
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Users & Subscriptions"
        subtitle={`${usersMeta.total || 0} Total Customers`}
      />

      {error && !usersLoading ? (
        <p className="mb-3 rounded-lg border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </p>
      ) : null}

      <DataTable
        showTabs
        tabs={USER_TABS}
        activeTab={tab}
        onTabChange={handleTabChange}
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or company…"
        showFilters
        filterLabel=""
        filters={filters}
        columns={userColumns}
        data={tableRows}
        loading={usersLoading}
        emptyMessage="No users found for the current filters."
        showActions
        getActions={rowActions}
        showPagination
        pagination={{
          page: usersMeta.page || page,
          pageSize: usersMeta.pageSize || PAGE_SIZE,
          total: usersMeta.total || 0,
          onPageChange: setPage,
        }}
      />

      <SuspendUserModal
        open={Boolean(suspendTarget)}
        userName={suspendTarget?.userName}
        onClose={() => setSuspendTarget(null)}
        onConfirm={(reason) => {
          if (suspendTarget) {
            handleStatusChange(suspendTarget.id, "Suspend", reason);
            setSuspendTarget(null);
          }
        }}
      />
    </PanelPage>
  );
};

export default AdminUsersView;
