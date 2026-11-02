import { useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";
import { CardSkeleton } from "@/components/loader";
import { SIDEBAR_LIMIT } from "../../constant/constants";
import { useAdvertisementDistribution } from "@/modules/dash/user/feed/context/AdvertisementDistributionContext";

const CATEGORY_LABEL = {
  PRODUCT: "Product",
  SERVICE: "Service",
  PROMO: "Promo",
  WEBINAR: "Webinar",
};

/**
 * Audience-facing sponsored advertisements rail (sidebar).
 *
 * Renders only the first 3 eligible, admin-approved ads from the distribution context.
 * Remaining ads are displayed in the feed as sponsored posts.
 * 
 * Records engagement: one impression per ad shown, and a click when an ad is activated.
 */
const SponsoredAdsCard = () => {
  const { sidebarAds: ads, loading, trackImpression, trackClick } = useAdvertisementDistribution();
  const impressed = useRef(new Set());

  // One impression per ad while it is on screen.
  useEffect(() => {
    ads.forEach((ad) => {
      if (ad?.id && !impressed.current.has(ad.id)) {
        impressed.current.add(ad.id);
        trackImpression(ad.id);
      }
    });
  }, [ads, trackImpression]);

  if (loading) {
    return (
      <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <h3 className="text-[14px] font-bold text-deep-blue">Sponsored</h3>
        </div>
        <CardSkeleton
          variant="sidebarListing"
          count={SIDEBAR_LIMIT}
          as="ul"
          className="divide-y divide-[#E4E7EC]"
        />
      </div>
    );
  }

  if (!ads.length) return null;

  const handleClick = async (ad) => {
    const redirectUrl = await trackClick(ad.id);
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  };

  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" />
        <h3 className="text-[14px] font-bold text-deep-blue">Sponsored</h3>
      </div>
      <ul className="space-y-3">
        {ads.map((ad) => (
          <li key={ad.id}>
            <button
              type="button"
              onClick={() => handleClick(ad)}
              className="flex w-full gap-3 rounded-lg p-1 text-left transition-colors hover:bg-[#F9FAFB]"
            >
              {ad.imageUrl ? (
                <img
                  src={ad.imageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-deep-blue">
                  {ad.title}
                </p>
                <p className="truncate text-[12px] text-[#64748B]">
                  {ad.supplier?.company || "Sponsored"}
                  {ad.category
                    ? ` · ${CATEGORY_LABEL[ad.category] || ad.category}`
                    : ""}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SponsoredAdsCard;
