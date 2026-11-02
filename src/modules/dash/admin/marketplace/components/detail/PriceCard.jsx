import { BadgeCheck, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatPrice } from "@/modules/dash/user/data/marketplace";

/** Price, optional Contact seller button and the verified note. */
const PriceCard = ({ price, canContact, onContact }) => (
  <Card className="p-5 sm:p-6">
    <p className="text-[32px] font-bold leading-none text-deep-blue">{formatPrice(price)}</p>
    <p className="mt-2 text-[12px] text-[#64748B]">Excl. VAT · Collection or delivery</p>

    {canContact ? (
      <button
        type="button"
        onClick={onContact}
        aria-haspopup="dialog"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
      >
        <MessageCircle className="h-4 w-4" />
        Contact seller
      </button>
    ) : null}

    <div className="mt-5 flex items-center gap-2 border-t border-[#E4E7EC] pt-4 text-[12px] text-[#64748B]">
      <BadgeCheck className="h-4 w-4 shrink-0 text-green-primary" />
      Verified Lab Unity member
    </div>
  </Card>
);

export default PriceCard;
