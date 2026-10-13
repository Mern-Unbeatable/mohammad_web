import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, RefreshCw } from "lucide-react";
import BarChartCard from "@/components/data-display/BarChartCard/BarChartCard";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import CategoryPill from "@/components/data-display/CategoryPill/CategoryPill";
import StatCard from "@/components/data-display/StatCard/StatCard";
import {
  BarChartCardSkeleton,
  NotificationRowSkeleton,
  StatCardSkeleton,
} from "@/components/common/Skeleton";
import Card from "@/components/ui/Card";
import CreateAdModal from "@/modules/supplier/components/CreateAdModal";
import {
  fetchSupplierDashboard,
  clearSupplierDashError,
} from "@/features/supplier/dashboard";
import { useAuth } from "@/shared/auth/useAuth";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import {
  panelPageTheme,
  panelPrimaryBtn,
} from "@/shared/layout/PanelLayout/panelPageTheme";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2].map(String);

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

const EmptyState = ({ message }) => (
  <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
    <p className="text-[14px] text-[#64748B]">{message}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
    <p className="text-[14px] font-medium text-[#B42318]">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    ) : null}
  </div>
);

const SupplierDashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, chart, recentAds, notifications, loading, error } =
    useSelector((state) => state.supplierDashboard);

  const [chartYear, setChartYear] = useState(String(currentYear));
  const [createOpen, setCreateOpen] = useState(false);

  const displayName =
    user?.profile?.name ||
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.name ||
    "Supplier";

  const load = () => {
    dispatch(clearSupplierDashError());
    dispatch(fetchSupplierDashboard(Number(chartYear)));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when year changes
  }, [dispatch, chartYear]);

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
      onClick: () => navigate(`/supplier/ads/${row.id}`),
    },
  ];

  return (
    <PanelPage>
      <div className="rounded-xl bg-deep-blue p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-bold leading-tight text-white sm:text-[28px] lg:text-[32px]">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-white/70 sm:text-[15px] lg:text-[16px]">
              Here&apos;s an overview of your advertisements and activity
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={`${panelPrimaryBtn} w-full shrink-0 gap-2 sm:w-auto`}
          >
            <Pencil className="h-4 w-4" />
            Create A Advertisement
          </button>
        </div>
      </div>

      {error ? <ErrorState message={error} onRetry={load} /> : null}

      {loading && !stats.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <StatCardSkeleton key={i} showHint />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.id} className="flex h-full flex-col p-4 sm:p-5">
              <StatCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                tone={stat.tone}
                className="!rounded-none !border-0 !bg-transparent !p-0 shadow-none"
              />
              <p className="mt-auto pt-3 text-[12px] text-[#98A2B3] sm:text-[13px]">
                {stat.hint}
              </p>
            </Card>
          ))}
        </div>
      )}

      {loading && !stats.length ? (
        <BarChartCardSkeleton />
      ) : (
        <BarChartCard
          title={chart.title}
          series={chart.series}
          labels={chart.labels}
          yTicks={chart.yTicks}
          yMax={chart.yMax}
          yearValue={chartYear}
          yearOptions={YEAR_OPTIONS}
          onYearChange={setChartYear}
          chartHeight={180}
          legendPosition="bottom"
          fullWidth
        />
      )}

      <Card className="overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className={panelPageTheme.cardTitle}>Recent Advertisements</h2>
            <p className={panelPageTheme.cardSubtitle}>
              Manage and track your latest campaigns
            </p>
          </div>
          <Link
            to="/supplier/ads"
            className="text-[13px] font-semibold text-primary hover:underline sm:text-[14px]"
          >
            View All →
          </Link>
        </div>

        {loading && !recentAds.length ? (
          <DataTable
            showCard={false}
            columns={columns}
            data={[]}
            loading
            showActions
            getActions={rowActions}
            tableMinWidth="900px"
          />
        ) : recentAds.length ? (
          <DataTable
            showCard={false}
            columns={columns}
            data={recentAds}
            showActions
            getActions={rowActions}
            tableMinWidth="900px"
          />
        ) : (
          <EmptyState message="No advertisements yet. Create your first campaign to get started." />
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <h2 className={panelPageTheme.cardTitle}>Recent Notifications</h2>
            <p className={panelPageTheme.cardSubtitle}>
              Latest updates about your advertisements
            </p>
          </div>
          <Link
            to="/supplier/notifications"
            className="text-[13px] font-semibold text-primary hover:underline sm:text-[14px]"
          >
            View All →
          </Link>
        </div>

        {loading && !notifications.length ? (
          <ul className="divide-y divide-[#E4E7EC]">
            {Array.from({ length: 3 }, (_, i) => (
              <NotificationRowSkeleton key={i} />
            ))}
          </ul>
        ) : notifications.length ? (
          <ul className="divide-y divide-[#E4E7EC]">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <div className="flex items-start gap-3 px-5 py-4 sm:gap-4 sm:px-6">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconClass}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold leading-snug text-deep-blue sm:text-[15px]">
                        {item.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B] sm:text-[14px]">
                        {item.subtitle}
                      </p>
                      <p className="mt-2 text-[12px] text-[#98A2B3] sm:text-[13px]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-5 py-8 sm:px-6">
            <EmptyState message="No notifications yet." />
          </div>
        )}
      </Card>

      <CreateAdModal
        key={createOpen ? "open" : "closed"}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </PanelPage>
  );
};

export default SupplierDashboardView;
