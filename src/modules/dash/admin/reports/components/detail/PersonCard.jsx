import { History, User } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";

const outlineBtn =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]";

/** Reporter or reported user. The reported variant adds status, warnings and Audit History. */
const PersonCard = ({ person, variant, onProfile, onAudit }) => {
  const reported = variant === "reported";

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar src={person.avatar} initials={person.initials} alt={person.name} size="md" />
          <div>
            <p className="text-[15px] font-bold text-deep-blue">{person.name}</p>
            <p className="text-[12px] text-[#64748B]">{person.title}</p>
            <p className="text-[12px] text-[#98A2B3]">
              {person.company}
              {person.country ? ` · ${person.country}` : ""}
            </p>
          </div>
        </div>
        {variant === "reporter" && person.badge ? (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary">
            {person.badge}
          </span>
        ) : null}
        {reported ? <StatusBadge status={person.status} label={person.status} /> : null}
      </div>

      {reported ? (
        <div className="border-b border-[#E4E7EC] px-5 py-3">
          <span className="inline-flex rounded-md bg-pink-secondary px-2.5 py-1 text-[11px] font-semibold text-pink-light">
            {person.warnings || 0} Warnings
          </span>
          <p className="mt-2 text-[12px] text-[#64748B]">
            {person.totalReports || 0} related moderation records
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 p-4 sm:flex-row">
        {reported ? (
          <>
            <button type="button" onClick={onProfile} className={outlineBtn}>
              User Profile
            </button>
            <button
              type="button"
              onClick={onAudit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-pink-secondary bg-pink-secondary/20 px-4 py-2.5 text-[13px] font-semibold text-pink-light hover:bg-pink-secondary/40"
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
  );
};

export default PersonCard;
