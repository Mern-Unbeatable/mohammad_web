import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import Card from "@/components/ui/Card";
import { AdCell, ADS_PATH } from "@/modules/dash/supplier/ads";
import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import { EMPTY_ADS_MESSAGE } from "../../constant/constants";

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

/** Latest ads table with a link to the full ads page. */
const RecentAdsCard = ({ ads, loading, rowActions }) => (
  <Card className="overflow-hidden p-4 sm:p-5">
    <SectionHeader
      title="Recent Advertisements"
      subtitle="Manage and track your latest campaigns"
      viewAllTo={ADS_PATH}
      className="mb-4"
    />

    {loading || ads.length ? (
      <DataTable
        showCard={false}
        columns={COLUMNS}
        data={loading ? [] : ads}
        loading={loading}
        showActions
        getActions={rowActions}
        tableMinWidth="900px"
      />
    ) : (
      <EmptyState message={EMPTY_ADS_MESSAGE} />
    )}
  </Card>
);

export default RecentAdsCard;
