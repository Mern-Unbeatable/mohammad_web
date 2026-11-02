import { Link } from 'react-router';
import { BadgeCheck, Heart, Mail, MessageCircle, Pencil } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import { formatPrice } from '@/modules/dash/user/data/marketplace';
import ContactLinkButton from './ContactLinkButton';

const primaryActionClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]';

/** Price, save toggle, and Edit (own listing) or Contact / Email / WhatsApp actions. */
const ListingPriceCard = ({ price, saved, onToggleSave, viewer, onContact }) => {
  const { isOwnListing, sellerId, editHref, emailHref, whatsAppHref } = viewer;

  return (
    <Card className="relative p-5 sm:p-6">
      <button
        type="button"
        onClick={onToggleSave}
        aria-label={saved ? 'Remove from saved' : 'Save listing'}
        aria-pressed={saved}
        title={saved ? 'Saved' : 'Save listing'}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-pink-light shadow-sm transition-colors hover:bg-pink-secondary sm:right-5 sm:top-5"
      >
        <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
      </button>
      <p className="pr-12 text-[32px] font-bold leading-none text-deep-blue">
        {formatPrice(price)}
      </p>
      <p className="mt-2 text-[12px] text-[#64748B]">Excl. VAT · Collection or delivery</p>

      <div className="mt-5 space-y-2.5">
        {isOwnListing ? (
          <Link to={editHref} className={primaryActionClass}>
            <Pencil className="h-4 w-4" />
            Edit listing
          </Link>
        ) : sellerId ? (
          <button
            type="button"
            onClick={onContact}
            aria-haspopup="dialog"
            className={primaryActionClass}
          >
            <MessageCircle className="h-4 w-4" />
            Contact seller
          </button>
        ) : null}
        {!isOwnListing && sellerId ? (
          <div className="grid grid-cols-2 gap-2.5">
            <ContactLinkButton
              href={emailHref}
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              unavailableLabel="Seller hasn't added an email"
              className="border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]"
            />
            <ContactLinkButton
              href={whatsAppHref}
              icon={<FaWhatsapp className="h-4 w-4" />}
              label="WhatsApp"
              unavailableLabel="Seller hasn't added a phone number"
              external
              className="border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[#E4E7EC] pt-4 text-[12px] text-[#64748B]">
        <BadgeCheck className="h-4 w-4 shrink-0 text-green-primary" />
        Verified Lab Unity member
      </div>
    </Card>
  );
};

export default ListingPriceCard;
