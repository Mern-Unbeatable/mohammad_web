import { useMemo } from "react";
import { Building2, CheckCircle2, UserRound, Users } from "lucide-react";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatCard from "@/components/data-display/StatCard/StatCard";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import SuspendUserModal from "@/components/modals/admin/SuspendUserModal";
import { getUserColumns } from "../components/list/userColumns";
import { useAdminUsers } from "../hooks/useAdminUsers";
import {
  PLAN_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  USER_TABS,
} from "../constant/constants";

const AdminUsersView = () => {
  const {
    error,
    total,
    summary,
    rows,
    loading,
    tab,
    isSupplierTab,
    changeTab,
    search,
    changeSearch,
    planFilter,
    changePlan,
    statusFilter,
    changeStatusFilter,
    rowActions,
    pagination,
    suspend,
  } = useAdminUsers();

  const columns = useMemo(() => getUserColumns(isSupplierTab), [isSupplierTab]);

  const filters = [
    ...(isSupplierTab
      ? []
      : [
          {
            id: "subscription",
            value: planFilter,
            options: PLAN_FILTER_OPTIONS,
            onChange: changePlan,
          },
        ]),
    {
      id: "status",
      value: statusFilter,
      options: STATUS_FILTER_OPTIONS,
      onChange: changeStatusFilter,
    },
  ];

  const stats = [
    {
      id: "total",
      icon: Users,
      tone: "blue",
      label: "Total members",
      value: summary.total ?? 0,
    },
    {
      id: "users",
      icon: UserRound,
      tone: "teal",
      label: "Users",
      value: summary.users ?? 0,
    },
    {
      id: "suppliers",
      icon: Building2,
      tone: "orange",
      label: "Suppliers",
      value: summary.suppliers ?? 0,
    },
    {
      id: "active",
      icon: CheckCircle2,
      tone: "green",
      label: "Active",
      value: summary.active ?? 0,
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader
        title="Users & Subscriptions"
        subtitle={`${total} Total Customers`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {error ? (
        <p className="mb-3 rounded-lg border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-[13px] text-[#B42318]">
          {error}
        </p>
      ) : null}

      <DataTable
        compact
        showTabs
        tabs={USER_TABS}
        activeTab={tab}
        onTabChange={changeTab}
        showSearch
        searchValue={search}
        onSearchChange={changeSearch}
        searchPlaceholder="Search by name, email, or company…"
        showFilters
        filterLabel=""
        filters={filters}
        columns={columns}
        data={rows}
        loading={loading}
        emptyMessage="No users found for the current filters."
        showActions
        getActions={rowActions}
        showPagination
        pagination={pagination}
      />

      <SuspendUserModal
        open={Boolean(suspend.target)}
        userName={suspend.target?.userName}
        onClose={suspend.close}
        onConfirm={suspend.confirm}
      />
    </PanelPage>
  );
};

export default AdminUsersView;
