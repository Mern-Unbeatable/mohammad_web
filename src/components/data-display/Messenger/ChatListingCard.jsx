import { Link } from 'react-router';
import { Loader2, Package, X } from 'lucide-react';

const Thumbnail = ({ image, title }) =>
  image ? (
    <img src={image} alt={title} className="h-14 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
  ) : (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
      <Package className="h-5 w-5" />
    </span>
  );

/**
 * Marketplace listing preview: inside messages (`tone` "me" / "them") and in
 * the composer (`onRemove` set). `listing` is a `toChatListingModel` result,
 * or `{ loading: true }` while it is fetched. Links to `href` when given.
 */
const ChatListingCard = ({ listing, href, tone = 'them', onRemove, className = '' }) => {
  if (!listing) return null;

  if (listing.loading) {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 py-2.5 text-[12px] text-[#64748B] ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading listing…
      </div>
    );
  }

  const surface =
    tone === 'me'
      ? 'border-primary/30 bg-white hover:border-primary'
      : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]';

  const body = (
    <>
      <Thumbnail image={listing.image} title={listing.title} />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
          Marketplace
        </span>
        <span className="mt-0.5 line-clamp-2 block text-[13px] font-semibold leading-snug text-deep-blue">
          {listing.title}
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-[12px]">
          {listing.price ? (
            <span className="font-semibold text-primary">{listing.price}</span>
          ) : null}
          {listing.statusLabel ? (
            <span className="rounded-full bg-[#F2F4F7] px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B]">
              {listing.statusLabel}
            </span>
          ) : null}
        </span>
      </span>
    </>
  );

  const cardClass = `flex w-full max-w-[320px] items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${surface} ${className}`;

  if (onRemove) {
    return (
      <div className={cardClass}>
        {body}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove listing"
          className="self-start rounded-full p-1 text-[#64748B] hover:bg-[#F2F4F7] hover:text-deep-blue"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return href ? (
    <Link to={href} className={cardClass} aria-label={`View listing: ${listing.title}`}>
      {body}
    </Link>
  ) : (
    <div className={cardClass}>{body}</div>
  );
};

export default ChatListingCard;
