import { Megaphone, Package, Tag, Video, Wrench } from "lucide-react";
import CategoryPill from "@/components/data-display/CategoryPill/CategoryPill";

const CATEGORY_ICON = {
  "product showcase": {
    icon: Package,
    className: "bg-secondary text-primary",
  },
  "service offering": {
    icon: Wrench,
    className: "bg-green-secondary text-green-primary",
  },
  "promotional offer": {
    icon: Tag,
    className: "bg-[#FEF3E8] text-[#E67E22]",
  },
  "webinar/event": {
    icon: Video,
    className: "bg-pink-secondary text-pink-light",
  },
};

const DEFAULT_ICON = {
  icon: Megaphone,
  className: "bg-[#F3F4F6] text-[#64748B]",
};

/** Advertisement title with category icon and pill. */
const AdCell = ({ row }) => {
  const key = String(row.category || "").trim().toLowerCase();
  const { icon: Icon, className } = CATEGORY_ICON[key] || DEFAULT_ICON;

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}
        aria-hidden="true"
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[13px] font-semibold text-deep-blue">{row.title}</p>
        <CategoryPill label={row.category} className="mt-0.5" />
      </div>
    </div>
  );
};

export default AdCell;
