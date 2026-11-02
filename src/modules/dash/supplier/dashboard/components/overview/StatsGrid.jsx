import StatCard from "@/components/data-display/StatCard/StatCard";
import { StatCardSkeleton } from "@/components/loader";
import Card from "@/components/ui/Card";
import { STAT_SKELETON_COUNT, STATS_GRID_CLASS } from "../../constant/constants";

/** Stat cards, each with a hint line under the value. */
const StatsGrid = ({ stats, loading }) => (
  <div className={STATS_GRID_CLASS}>
    {loading
      ? Array.from({ length: STAT_SKELETON_COUNT }, (_, i) => <StatCardSkeleton key={i} showHint />)
      : stats.map((stat) => (
          <Card key={stat.id} className="flex h-full flex-col p-4 sm:p-5">
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              tone={stat.tone}
              className="!rounded-none !border-0 !bg-transparent !p-0 shadow-none"
            />
            <p className="mt-auto pt-3 text-[12px] text-[#98A2B3] sm:text-[13px]">{stat.hint}</p>
          </Card>
        ))}
  </div>
);

export default StatsGrid;
