import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import Card from "@/components/ui/Card";
import { CardSkeleton } from "@/components/loader";
import { SIDEBAR_LIMIT } from "../../constant/constants";
import { EmptyRow, SectionTitle } from "./SidebarSection";

const MarketplaceList = ({ items, loading }) => (
  <Card>
    <SectionTitle icon={ShoppingBag}>Latest in the marketplace</SectionTitle>
    {loading && !items.length ? (
      <CardSkeleton
        variant="sidebarListing"
        count={SIDEBAR_LIMIT}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    ) : items.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {items.map(({ id, title, meta, price, image, to }) => (
          <li key={id}>
            <Link
              to={to}
              className="flex items-start gap-3 px-4 py-2 transition-colors hover:bg-[#F9FAFB]"
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border border-[#E4E7EC] bg-white object-cover"
                />
              ) : (
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] text-[#98A2B3]">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-deep-blue hover:text-primary">
                  {title}
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748B]">{meta}</p>
                <p className="mt-1 text-[13px] font-bold text-primary">
                  {price}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRow message="No listings yet." />
    )}
  </Card>
);

export default MarketplaceList;
