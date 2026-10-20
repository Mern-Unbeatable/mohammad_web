import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import { Ban, CheckCircle2, Eye } from "lucide-react";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import SuspendUserModal from "@/modules/dash/admin/components/SuspendUserModal";
import SubscriptionPill from "@/modules/dash/admin/components/SubscriptionPill";
import { fetchUsersList, updateUserStatus } from "@/features/dash/admin/users";

const PAGE_SIZE = 10;

const USER_TABS = [
  { id: "all", label: "All Users" },
  { id: "user", label: "Users" },
  { id: "supplier", label: "Supplier" },
];

const TAB_IDS = USER_TABS.map((t) => t.id);
const PLAN_VALUES = ["all", "monthly", "yearly", "free"];
const STATUS_VALUES = ["all", "active", "suspend", "banned"];

const pick = (value, allowed) => (allowed.includes(value) ? value : "all");

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

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = pick(searchParams.get("tab"), TAB_IDS);
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const planFilter = pick(searchParams.get("plan"), PLAN_VALUES);
  const statusFilter = pick(searchParams.get("status"), STATUS_VALUES);
  const debouncedSearch = searchParams.get("q") || "";

  const [search, setSearch] = useState(debouncedSearch);
  const [syncedSearch, setSyncedSearch] = useState(debouncedSearch);
  const [suspendTarget, setSuspendTarget] = useState(null);

  if (syncedSearch !== debouncedSearch) {
    setSyncedSearch(debouncedSearch);
    setSearch(debouncedSearch);
  }

  const isSupplierTab = tab === "supplier";

  /** Merges `changes` into the URL; "all"/empty values and page 1 are dropped. */
  const updateParams = (changes) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        if (
          value == null ||
          value === "" ||
          value === "all" ||
          (key === "page" && Number(value) <= 1)
        ) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  useEffect(() => {
    const q = search.trim();
    if (q === debouncedSearch) return undefined;
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) next.set("q", q);
          else next.delete("q");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch, setSearchParams]);

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
        avatar: u.profile?.avatar || "",
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
    updateParams({ tab: nextTab, page: 1, plan: "all", status: "all" });
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
      icon: Eye,
      onClick: () => navigate(`/admin/users/${row.id}`),
    },
    {
      id: "active",
      label: "Active",
      icon: CheckCircle2,
      disabled: () => row.status === "Active",
      onClick: () => handleStatusChange(row.id, "Active"),
    },
    {
      id: "suspend",
      label: "Suspend",
      icon: Ban,
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
            onChange: (value) => updateParams({ plan: value, page: 1 }),
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
      onChange: (value) => updateParams({ status: value, page: 1 }),
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
          onPageChange: (nextPage) => updateParams({ page: nextPage }),
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
