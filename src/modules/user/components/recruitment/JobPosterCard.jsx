import { Link } from "react-router";
import { MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

/** "Posted by" card for the member who created a job. */
const JobPosterCard = ({ owner, isSelf = false }) => {
  if (!owner?.id) return null;

  const name =
    owner.name ||
    [owner.firstName, owner.lastName].filter(Boolean).join(" ") ||
    "Member";
  const headline = [owner.title, owner.company].filter(Boolean).join(" · ");
  const location = owner.location || owner.country;
  const profileHref = isSelf ? "/profile" : `/contacts/${owner.id}`;

  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-4">
      <h2 className="text-[18px] font-bold text-deep-blue">Posted by</h2>

      <div className="mt-3 flex items-start gap-3">
        <Link to={profileHref} aria-label={`View ${name}'s profile`}>
          <Avatar src={owner.avatar} alt={name} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={profileHref}
            className="block truncate text-[15px] font-semibold text-deep-blue hover:text-primary hover:underline"
          >
            {name}
            {isSelf ? (
              <span className="ml-1.5 text-[12px] font-medium text-[#98A2B3]">(You)</span>
            ) : null}
          </Link>
          {headline ? (
            <p className="mt-0.5 text-[13px] text-[#64748B] [overflow-wrap:anywhere]">
              {headline}
            </p>
          ) : null}
          {location ? (
            <p className="mt-1 flex items-center gap-1 text-[12px] text-[#98A2B3]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-light" />
              <span className="truncate">{location}</span>
            </p>
          ) : null}
        </div>
      </div>

      <Link
        to={profileHref}
        className="mt-4 flex w-full items-center justify-center rounded-lg border border-primary/30 px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
      >
        View profile
      </Link>
    </section>
  );
};

export default JobPosterCard;
