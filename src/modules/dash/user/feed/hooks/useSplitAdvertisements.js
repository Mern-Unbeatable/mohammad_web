import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/config/client";

const SIDEBAR_AD_LIMIT = 3;
const FEED_PAGE_SIZE = 20;

/**
 * useSplitAdvertisements: Manages advertisement distribution between sidebar and feed.
 * 
 * Strategy:
 * - Fetches all eligible active ads from a unified endpoint
 * - Splits ads: first 3 for sidebar, remaining for feed
 * - Prevents duplicates: an ad can only appear in one location during a session
 * - Provides both sidebar ads and feed ads
 */
export function useSplitAdvertisements() {
  const [sidebarAds, setSidebarAds] = useState([]);
  const [feedAds, setFeedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all eligible ads and split them
  useEffect(() => {
    let active = true;

    const fetchAndSplit = async () => {
      try {
        setLoading(true);
        
        // Fetch all eligible ads (large page size to get everything in one call)
        const response = await axiosInstance.get("/feed/ads/active", {
          params: {
            page: 1,
            pageSize: 100, // Fetch many ads to ensure we get all available
          },
        });

        if (!active) return;

        const allAds = Array.isArray(response.data) ? response.data : [];

        // Split: first 3 for sidebar, rest for feed
        const sidebar = allAds.slice(0, SIDEBAR_AD_LIMIT);
        const feed = allAds.slice(SIDEBAR_AD_LIMIT);

        setSidebarAds(sidebar);
        setFeedAds(feed);
        setError(null);
      } catch (err) {
        if (!active) return;
        const message = err.response?.data?.message || "Failed to load advertisements";
        setError(message);
        setSidebarAds([]);
        setFeedAds([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAndSplit();

    return () => {
      active = false;
    };
  }, []);

  // Track impression when user sees an ad
  const trackImpression = useCallback(async (adId) => {
    try {
      await axiosInstance.post(`/supplier/advertisements/${adId}/track/views`);
    } catch (err) {
      // Silent fail: don't break UX for tracking failures
      console.warn(`Failed to track impression for ad ${adId}`, err);
    }
  }, []);

  // Track click when user clicks CTA
  const trackClick = useCallback(async (adId) => {
    try {
      await axiosInstance.post(`/supplier/advertisements/${adId}/track/clicks`);
    } catch (err) {
      // Silent fail: don't break UX for tracking failures
      console.warn(`Failed to track click for ad ${adId}`, err);
    }
  }, []);

  return {
    sidebarAds,
    feedAds,
    loading,
    error,
    trackImpression,
    trackClick,
    refresh: () => {
      // Trigger refetch by clearing state
      setSidebarAds([]);
      setFeedAds([]);
      setLoading(true);
    },
  };
}
