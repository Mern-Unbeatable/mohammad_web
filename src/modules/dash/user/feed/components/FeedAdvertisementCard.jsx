import { memo, useCallback, useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import "./FeedAdvertisementCard.css";

/**
 * FeedAdvertisementCard: Displays an advertisement in the user feed.
 * 
 * Features:
 * - Responsive card layout with sponsor label
 * - Image/video display with lazy loading
 * - Supplier profile info
 * - Category-specific CTA buttons
 * - Impression tracking via Intersection Observer
 * - Click tracking
 */
const FeedAdvertisementCard = memo(({
  ad,
  onTrackImpression,
  onTrackClick,
}) => {
  const cardRef = useRef(null);
  const impressionTrackedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  // Track impression when ad becomes visible in viewport
  useEffect(() => {
    if (!cardRef.current || impressionTrackedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !impressionTrackedRef.current) {
          impressionTrackedRef.current = true;
          onTrackImpression?.(ad.id);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [ad.id, onTrackImpression]);

  const handleCTAClick = useCallback(async () => {
    if (redirecting) return;
    setRedirecting(true);
    try {
      const result = await onTrackClick?.(ad.id);
      const redirectUrl = result || `/contacts/${ad.supplier.id}`;
      window.location.assign(redirectUrl);
    } finally {
      setRedirecting(false);
    }
  }, [ad.id, ad.supplier.id, onTrackClick, redirecting]);

  const getCTAText = () => {
    switch (ad.category) {
      case "PRODUCT":
        return "View Product";
      case "SERVICE":
        return "View Service";
      case "PROMO":
        return "View Offer";
      case "WEBINAR":
        return "Register Now";
      default:
        return "Learn More";
    }
  };

  const getSupplierName = () => {
    const { firstName, lastName, company } = ad.supplier;
    if (company) return company;
    const name = [firstName, lastName].filter(Boolean).join(" ");
    return name || "Supplier";
  };

  return (
    <Card className="feed-advertisement-card" ref={cardRef}>
      <div className="relative">
        {/* Sponsored Badge */}
        <div className="feed-ad-sponsored-badge">
          <span>Sponsored</span>
        </div>

        {/* Media: Image or Video */}
        {ad.imageUrl || ad.videoUrl ? (
          <div className="feed-ad-media">
            {ad.videoUrl ? (
              <video
                src={ad.videoUrl}
                className="feed-ad-media-content"
                controls
                loading="lazy"
              />
            ) : (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="feed-ad-media-content"
                loading="lazy"
              />
            )}
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="feed-ad-content">
        {/* Supplier Info */}
        <div className="feed-ad-supplier">
          {ad.supplier.avatarUrl ? (
            <img
              src={ad.supplier.avatarUrl}
              alt={getSupplierName()}
              className="feed-ad-supplier-avatar"
            />
          ) : (
            <div className="feed-ad-supplier-initials">
              {ad.supplier.initials || "S"}
            </div>
          )}
          <div className="feed-ad-supplier-info">
            <p className="feed-ad-supplier-name">{getSupplierName()}</p>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="feed-ad-title">{ad.title}</h3>
        <p className="feed-ad-description">{ad.description}</p>

        {/* Ad Metadata */}
        {(ad.price || ad.location || ad.eventDate) && (
          <div className="feed-ad-metadata">
            {ad.price && (
              <span className="feed-ad-metadata-item">
                <strong>${ad.price.toFixed(2)}</strong>
              </span>
            )}
            {ad.location && (
              <span className="feed-ad-metadata-item">
                📍 {ad.location}
              </span>
            )}
            {ad.eventDate && (
              <span className="feed-ad-metadata-item">
                📅 {new Date(ad.eventDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="feed-ad-cta-button"
          onClick={handleCTAClick}
          disabled={redirecting}
          aria-label={`${getCTAText()} - ${ad.title}`}
        >
          {getCTAText()}
        </button>
      </div>
    </Card>
  );
});

FeedAdvertisementCard.displayName = "FeedAdvertisementCard";

export default FeedAdvertisementCard;
