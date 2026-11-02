import { memo, useCallback, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import "./FeedSponsoredPost.css";

/**
 * FeedSponsoredPost: Displays remaining feed advertisements as sponsored posts.
 * 
 * Similar to FeedAdvertisementCard but styled as a regular post to blend into the feed.
 * Used for ads that don't fit in the sidebar (4th ad and beyond).
 * 
 * Features:
 * - Sponsored post layout (looks like organic feed post)
 * - Responsive design
 * - Impression tracking
 * - Click tracking
 */
const FeedSponsoredPost = memo(({
  ad,
  onTrackImpression,
  onTrackClick,
}) => {
  const cardRef = useRef(null);
  const impressionTrackedRef = useRef(false);

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

  const handleCTAClick = useCallback(() => {
    onTrackClick?.(ad.id);
    
    // Route based on category
    switch (ad.category) {
      case "PRODUCT":
        window.location.href = `/supplier/${ad.supplier.id}`;
        break;
      case "SERVICE":
        window.location.href = `/supplier/${ad.supplier.id}`;
        break;
      case "PROMO":
        window.location.href = `/supplier/${ad.supplier.id}`;
        break;
      case "WEBINAR":
        window.location.href = `/supplier/${ad.supplier.id}`;
        break;
      default:
        window.location.href = `/supplier/${ad.supplier.id}`;
    }
  }, [ad, onTrackClick]);

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
    <Card className="feed-sponsored-post" ref={cardRef}>
      {/* Header with Sponsored badge */}
      <div className="feed-sponsored-post-header">
        <div className="feed-sponsored-post-supplier">
          {ad.supplier.avatarUrl ? (
            <img
              src={ad.supplier.avatarUrl}
              alt={getSupplierName()}
              className="feed-sponsored-post-avatar"
            />
          ) : (
            <div className="feed-sponsored-post-avatar-initials">
              {ad.supplier.initials || "S"}
            </div>
          )}
          <div className="feed-sponsored-post-supplier-info">
            <p className="feed-sponsored-post-supplier-name">{getSupplierName()}</p>
            <p className="feed-sponsored-post-category">
              {ad.category === "PRODUCT" && "Product"}
              {ad.category === "SERVICE" && "Service"}
              {ad.category === "PROMO" && "Promotion"}
              {ad.category === "WEBINAR" && "Webinar"}
            </p>
          </div>
        </div>
        <div className="feed-sponsored-badge">Sponsored</div>
      </div>

      {/* Media */}
      {ad.imageUrl || ad.videoUrl ? (
        <div className="feed-sponsored-post-media">
          {ad.videoUrl ? (
            <video
              src={ad.videoUrl}
              className="feed-sponsored-post-media-content"
              controls
              loading="lazy"
            />
          ) : (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="feed-sponsored-post-media-content"
              loading="lazy"
            />
          )}
        </div>
      ) : null}

      {/* Content */}
      <div className="feed-sponsored-post-content">
        <h3 className="feed-sponsored-post-title">{ad.title}</h3>
        <p className="feed-sponsored-post-description">{ad.description}</p>

        {/* Metadata */}
        {(ad.price || ad.location || ad.eventDate) && (
          <div className="feed-sponsored-post-metadata">
            {ad.price && (
              <span className="feed-sponsored-post-metadata-item">
                <strong>${ad.price.toFixed(2)}</strong>
              </span>
            )}
            {ad.location && (
              <span className="feed-sponsored-post-metadata-item">
                📍 {ad.location}
              </span>
            )}
            {ad.eventDate && (
              <span className="feed-sponsored-post-metadata-item">
                📅 {new Date(ad.eventDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="feed-sponsored-post-cta-button"
          onClick={handleCTAClick}
          aria-label={`${getCTAText()} - ${ad.title}`}
        >
          {getCTAText()}
        </button>
      </div>
    </Card>
  );
});

FeedSponsoredPost.displayName = "FeedSponsoredPost";

export default FeedSponsoredPost;
