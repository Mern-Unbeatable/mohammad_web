import { Link } from "react-router";
import { Eye, ImageOff } from "lucide-react";
import { CONTENT_STATUS_CLASS } from "../../constant/constants";

/** One ad / listing / job: thumbnail, title link, meta line, status, stats and a View link. */
const ContentRow = ({ item, details }) => (
  <li className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] p-3 transition-colors hover:border-primary/40">
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg border border-[#E4E7EC] bg-white object-contain p-0.5"
      />
    ) : (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] text-[#98A2B3]">
        <ImageOff className="h-5 w-5" />
      </span>
    )}
    <div className="min-w-0 flex-1">
      <Link
        to={details.href}
        className="block truncate text-[14px] font-semibold text-deep-blue hover:text-primary hover:underline"
      >
        {item.title}
      </Link>
      <p className="mt-0.5 truncate text-[12px] text-[#64748B]">
        {details.meta.filter(Boolean).join(" · ")}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            CONTENT_STATUS_CLASS[item.status] || CONTENT_STATUS_CLASS.EXPIRED
          }`}
        >
          {item.status}
        </span>
        {details.stats.map((stat) => (
          <span
            key={stat.label}
            className="inline-flex items-center gap-1 text-[11px] text-[#64748B]"
          >
            <stat.icon className="h-3.5 w-3.5" />
            {stat.value} {stat.label}
          </span>
        ))}
      </div>
    </div>
    <Link
      to={details.href}
      aria-label={`View ${item.title}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
    >
      <Eye className="h-3.5 w-3.5" />
      View
    </Link>
  </li>
);

export default ContentRow;
