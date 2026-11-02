import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/config/client";

const FEED_PAGE_SIZE = 10;

/**
 * Hook to fetch and manage ads for display in the feed.
 * Handles pagination, tracking impressions/clicks, and deduplication.
 */
export function useFeedAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adIds, setAdIds] = useState(new Set());

  // Fetch ads from the server
  const fetchAds = useCallback(async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const response = await axiosInstance.get("/user/feed/ads/active", {
        params: {
          page: pageNum,
          pageSize: FEED_PAGE_SIZE,
        },
      });

      const newAds = response.data || [];
      
      // Deduplication: only add ads we haven't seen before
      const newAdIds = new Set(adIds);
      const deduplicatedAds = newAds.filter((ad) => {
        if (newAdIds.has(ad.id)) {
          return false;
        }
        newAdIds.add(ad.id);
        return true;
      });

      if (pageNum === 1) {
        setAds(deduplicatedAds);
      } else {
        setAds((prev) => [...prev, ...deduplicatedAds]);
      }

      setAdIds(newAdIds);
      setPage(pageNum);
      setTotalPages(response.meta?.totalPages || 1);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load advertisements";
      setError(message);
      if (pageNum === 1) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [adIds]);

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

  // Load more ads
  const loadMore = useCallback(() => {
    if (page < totalPages) {
      fetchAds(page + 1);
    }
  }, [page, totalPages, fetchAds]);

  // Initial load
  useEffect(() => {
    fetchAds(1);
  }, []);

  return {
    ads,
    loading,
    error,
    page,
    totalPages,
    hasMore: page < totalPages,
    loadMore,
    trackImpression,
    trackClick,
    refresh: () => fetchAds(1),
  };
}
