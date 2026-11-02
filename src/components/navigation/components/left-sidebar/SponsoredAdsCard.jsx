import { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";
import { adsApi } from "@/features/dash/supplier/advertisements";

const CATEGORY_LABEL = {
  PRODUCT: "Product",
  SERVICE: "Service",
  PROMO: "Promo",
  WEBINAR: "Webinar",
};

/**
 * Audience-facing sponsored advertisements rail.
 *
 * Renders the live, admin-approved ads from `GET /advertisements/active` and
 * records engagement: one impression per ad shown, and a click when an ad is
 * activated. This is the surface that actually delivers the advertising product
 * suppliers pay for.
 */
const SponsoredAdsCard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const impressed = useRef(new Set());

  useEffect(() => {
    let active = true;
    adsApi
      .getActiveAds({ pageSize: 3 })
      .then((res) => {
        if (active) setAds(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setAds([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // One impression per ad while it is on screen.
  useEffect(() => {
    ads.forEach((ad) => {
      if (ad?.id && !impressed.current.has(ad.id)) {
        impressed.current.add(ad.id);
        adsApi.trackAd(ad.id, "views");
      }
    });
  }, [ads]);

  if (loading || !ads.length) return null;

  const handleClick = (ad) => {
    adsApi.trackAd(ad.id, "clicks");
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
