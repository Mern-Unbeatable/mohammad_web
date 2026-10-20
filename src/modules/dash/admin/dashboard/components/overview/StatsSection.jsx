import StatCard from "@/components/data-display/StatCard/StatCard";
import { CardSkeleton } from "@/components/loader";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { STAT_GRID_CLASS, STAT_SKELETON_COUNT } from "../../constant/constants";

/** KPI cards with loading, error (retry) and empty states. */
const StatsSection = ({ stats, loading, error, hasStats, onRetry }) => {
  if (loading) {
    return <CardSkeleton variant="statCard" count={STAT_SKELETON_COUNT} className={STAT_GRID_CLASS} />;
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!hasStats) return <EmptyState message="No dashboard statistics available yet." />;

  return (
    <div className={STAT_GRID_CLASS}>
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;
