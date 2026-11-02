import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const SpecTile = ({ label, value }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
    <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
    <p className="mt-1 text-[14px] font-semibold text-deep-blue">{value}</p>
  </div>
);

/** Badges, title, description and the spec tiles. */
const ListingInfoCard = ({ listing }) => (
  <Card>
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="information">{listing.condition}</Badge>
        <Badge variant="post">Year {listing.year}</Badge>
        <Badge variant="post">{listing.category}</Badge>
      </div>

      <div>
        <h1 className="text-[24px] font-bold leading-tight text-deep-blue sm:text-[26px]">
          {listing.title}
        </h1>
        <p className="mt-3 whitespace-pre-line text-[14px] leading-[1.7] text-[#475467] [overflow-wrap:anywhere]">
          {listing.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SpecTile label="Location" value={listing.location} />
        <SpecTile label="Condition" value={listing.condition} />
        <SpecTile label="Year of manufacture" value={listing.year} />
        <SpecTile label="Listed" value={listing.listedAt || "—"} />
      </div>
    </div>
  </Card>
);

export default ListingInfoCard;
