import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { supplierProfilePath } from "../../constant/constants";

/** Supplier who created the advertisement, with a link to their admin user page. */
const AdCreatorCard = ({ creator }) => {
  if (!creator) return null;

  const subtitle = [creator.title, creator.company, creator.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
        Created by
      </p>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Avatar
            src={creator.avatar}
            alt={creator.name}
            initials={creator.initials}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-deep-blue">
              {creator.name}
            </p>
            {subtitle ? (
              <p className="mt-0.5 text-[12px] leading-snug text-[#64748B]">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {creator.id ? (
          <Link
            to={supplierProfilePath(creator.id)}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-[#E3EEF8]"
          >
            View user profile
          </Link>
        ) : null}
      </Card>
    </div>
  );
};

export default AdCreatorCard;
