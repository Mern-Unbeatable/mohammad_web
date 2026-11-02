import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { sellerProfilePath } from "../../constant/constants";

/** Seller avatar, name, title / company and a link to their admin user page. */
const SellerCard = ({ seller }) => (
  <div>
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">Seller</p>
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Avatar
          src={seller.avatar}
          alt={seller.name}
          initials={seller.initials}
          size="md"
          className={seller.avatarClass}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-deep-blue">{seller.name}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-[#64748B]">
            {seller.title} · {seller.company}
          </p>
        </div>
      </div>
      {seller.id ? (
        <Link
          to={sellerProfilePath(seller.id)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-[#E3EEF8]"
        >
          View seller profile
        </Link>
      ) : null}
    </Card>
  </div>
);

export default SellerCard;
