import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SpecTile from './SpecTile';

/** Badges, title, description and spec tiles. */
const ListingOverviewCard = ({ listing }) => (
  <Card>
    <div className="space-y-5 p-5 sm:p-6">
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
        <SpecTile label="Category" value={listing.category} />
        <SpecTile label="Condition" value={listing.condition} />
        <SpecTile label="Year" value={listing.year} />
        <SpecTile label="Location" value={listing.location} />
        <SpecTile label="Seller" value={listing.seller.name} />
        <SpecTile label="Listed" value={listing.listedAt} />
      </div>
    </div>
  </Card>
);

export default ListingOverviewCard;
