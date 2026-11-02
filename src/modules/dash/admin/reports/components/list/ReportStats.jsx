import StatCard from "@/components/data-display/StatCard/StatCard";
import { CardSkeleton } from "@/components/loader";
import { REPORT_ICONS, STAT_GRID_CLASS, STAT_SKELETON_COUNT } from "../../constant/constants";

/** Total / pending / review / resolved cards, or skeletons on first load. */
const ReportStats = ({ cards, loading }) =>
  loading ? (
    <CardSkeleton variant="statCard" count={STAT_SKELETON_COUNT} className={STAT_GRID_CLASS} />
  ) : (
    <div className={STAT_GRID_CLASS}>
      {cards.map((stat) => (
        <StatCard key={stat.id} icon={REPORT_ICONS[stat.id]} {...stat} />
      ))}
    </div>
  );

export default ReportStats;
