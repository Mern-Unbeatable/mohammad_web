import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "@/config/client";
import { fetchAdvertisementsRail } from "@/features/dash/user/advertisementsRail";

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
  const dispatch = useDispatch();
  const { sidebarAds, feedAds, loading, error } = useSelector(
    (state) => state.userAdvertisementsRail,
  );

  useEffect(() => {
    dispatch(fetchAdvertisementsRail());
  }, [dispatch]);

  // Track impression when user sees an ad
  const trackImpression = useCallback(async (adId) => {
    try {
      await axiosInstance.post(`/advertisements/${adId}/track/views`);
    } catch (err) {
      // Silent fail: don't break UX for tracking failures
      console.warn(`Failed to track impression for ad ${adId}`, err);
    }
  }, []);

  // Track click when user clicks CTA
  const trackClick = useCallback(async (adId) => {
    try {
      const result = await axiosInstance.post(`/advertisements/${adId}/cta`);
      return result?.data?.redirectUrl || null;
    } catch (err) {
      // Silent fail: don't break UX for tracking failures
      console.warn(`Failed to track click for ad ${adId}`, err);
      return null;
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
      dispatch(fetchAdvertisementsRail({ force: true }));
    },
  };
}
