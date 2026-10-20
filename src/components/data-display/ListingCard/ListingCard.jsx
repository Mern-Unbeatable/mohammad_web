import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatPrice } from '@/modules/dash/user/data/marketplace';

const ListingCard = ({
  listing,
  variant = 'browse',
  detailHref,
  saved = false,
  onToggleSave,
  onDelete,
  onEdit,
}) => {
  const href = detailHref || `/marketplace/${listing.id}`;
  const sellerLine = `${listing.seller.company} · ${listing.location}`;

  return (
    <Card className="flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F9FAFB]">
        <Link to={href} className="block h-full w-full">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] font-medium text-[#98A2B3]">
              No photo
            </div>
          )}
        </Link>
        {variant !== 'mine' && (
          <button
            type="button"
            onClick={() => onToggleSave?.(listing.id)}
            aria-label={saved ? 'Remove from saved' : 'Save listing'}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-pink-light transition-colors hover:bg-pink-secondary"
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link
          to={href}
          className="line-clamp-2 text-[14px] font-bold leading-snug text-deep-blue transition-colors hover:text-primary"
        >
          {listing.title}
        </Link>
        <p className="mt-1.5 text-[12px] text-[#64748B]">
          {listing.condition} · {listing.year}
        </p>
        <p className="mt-2 text-[18px] font-bold text-green-primary">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-1 line-clamp-1 text-[12px] text-[#98A2B3]">{sellerLine}</p>

        <div className="mt-4">
          {variant === 'admin' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onDelete?.(listing.id)}
                className="rounded-md bg-pink-light px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90"
              >
                Delete
              </button>
              <Link
                to={href}
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
              >
                View Details
              </Link>
            </div>
          ) : variant === 'mine' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(listing.id)}
                className="rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(listing.id)}
                className="rounded-md bg-[#CC1016] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#B30E13]"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              to={href}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;
