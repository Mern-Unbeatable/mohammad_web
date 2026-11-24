import { createContext, useContext, useMemo } from "react";
import { useSplitAdvertisements } from "../hooks/useSplitAdvertisements";

/**
 * AdvertisementDistributionContext
 * 
 * Shares advertisement distribution across sidebar and feed components.
 * Ensures that ads are split correctly:
 * - First 3 ads go to sidebar
 * - Remaining ads appear in feed
 * - No duplicates during the session
 */
const AdvertisementDistributionContext = createContext({
  sidebarAds: [],
  feedAds: [],
  loading: false,
  error: null,
  trackImpression: () => {},
  trackClick: () => {},
  refresh: () => {},
});

/**
 * Provider that wraps the feed page and supplies ad distribution to children.
 */
export function AdvertisementDistributionProvider({ children }) {
  const distribution = useSplitAdvertisements();

  const value = useMemo(() => distribution, [distribution]);

  return (
    <AdvertisementDistributionContext.Provider value={value}>
      {children}
    </AdvertisementDistributionContext.Provider>
  );
}

/**
 * Hook to access advertisement distribution from anywhere in the feed tree.
 */
export function useAdvertisementDistribution() {
  const context = useContext(AdvertisementDistributionContext);
  if (!context) {
    throw new Error(
      "useAdvertisementDistribution must be used within AdvertisementDistributionProvider"
    );
  }
  return context;
}
