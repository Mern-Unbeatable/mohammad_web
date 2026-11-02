import { CardSkeleton } from "@/components/loader";
import ListingCard from "@/components/data-display/ListingCard/ListingCard";
import {
  LISTING_GRID_CLASS,
  MARKETPLACE_PAGE_SIZE,
  listingDetailPath,
} from "../../constant/constants";

/** Skeletons on first load, an empty message, or the admin listing cards. */
const ListingsGrid = ({ items, loading, deleting, onDelete }) => {
  if (loading) {
    return <CardSkeleton variant="listing" count={MARKETPLACE_PAGE_SIZE} className={LISTING_GRID_CLASS} />;
  }

  if (!items.length) {
    return (
      <p className="py-16 text-center text-sm text-[#64748B]">
        No listings found for this category.
      </p>
    );
  }

  return (
    <div className={LISTING_GRID_CLASS}>
      {items.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          variant="admin"
          detailHref={listingDetailPath(listing.id)}
          onDelete={deleting ? undefined : onDelete}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;
