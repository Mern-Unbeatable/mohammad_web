import { History, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";

const outlineBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-3 py-2 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]";

/** Reporter or reported user card for the report detail sidebar. */
const PersonCard = ({ person, variant, onProfile, onAudit }) => {
  const reported = variant === "reported";
  const subtitle = [person.title, person.company, person.country].filter(Boolean).join(" · ");

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
        {reported ? "Reported user" : "Reported by"}
      </p>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              src={person.avatar}
              initials={person.initials}
              alt={person.name}
              size="sm"
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-deep-blue">{person.name}</p>
              {subtitle ? (
                <p className="mt-0.5 truncate text-[12px] leading-snug text-[#64748B]">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
          {reported ? <StatusBadge status={person.status} label={person.status} /> : null}
        </div>

        {reported ? (
          <div className="border-t border-[#E4E7EC] px-4 py-3">
            <span className="inline-flex rounded-md bg-pink-secondary px-2 py-0.5 text-[11px] font-semibold text-pink-light">
              {person.warnings || 0} Warnings
            </span>
            <p className="mt-1.5 text-[12px] text-[#64748B]">
              {person.totalReports || 0} related moderation records
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-[#E4E7EC] px-4 py-3">
          {reported ? (
            <>
              <button type="button" onClick={onProfile} className={outlineBtn}>
                User Profile
              </button>
              <button
                type="button"
                onClick={onAudit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-pink-secondary bg-pink-secondary/20 px-3 py-2 text-[13px] font-semibold text-pink-light hover:bg-pink-secondary/40"
              >
                <History className="h-4 w-4" />
                Audit History
              </button>
            </>
          ) : (
            <button type="button" onClick={onProfile} className={outlineBtn}>
              <User className="h-4 w-4" />
              View Reporter Profile
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PersonCard;
