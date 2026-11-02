import { useMemo } from "react";
import { CardSkeleton } from "@/components/loader";
import { useUserPresence } from "@/features/messages";
import FeedPost from "./post/FeedPost";
import FeedAdvertisementCard from "./FeedAdvertisementCard";
import FeedSponsoredPost from "./FeedSponsoredPost";
import LoadMorePosts from "./LoadMorePosts";

const messageClass =
  "rounded-xl border border-[#E4E7EC] bg-white px-4 py-10 text-center text-[14px] text-[#64748B]";

/**
 * Insert ads into the feed naturally.
 * Strategy:
 * - Display FeedAdvertisementCard ads (from old ad merging logic) after N posts
 * - Display FeedSponsoredPost ads (from feed overflow, 4th ad+) naturally interspersed
 * - Mix both types to avoid ad clustering
 */
const ADS_INTERVAL = 5;

const mergePostsWithAds = (posts, feedAds, trackImpression, trackClick) => {
  if (!feedAds || feedAds.length === 0) {
    // No feed ads, just return posts
    return posts.map((post) => ({
      type: "post",
      data: post,
    }));
  }

  const merged = [];
  let feedAdIndex = 0;
  let adsInserted = 0;

  for (let i = 0; i < posts.length; i++) {
    merged.push({
      type: "post",
      data: posts[i],
    });

    // Insert a sponsored post after every N posts (if we have remaining ads)
    if ((i + 1) % ADS_INTERVAL === 0 && feedAdIndex < feedAds.length) {
      merged.push({
        type: "sponsored-post",
        data: feedAds[feedAdIndex],
        trackImpression,
        trackClick,
      });
      feedAdIndex++;
      adsInserted++;
    }
  }

  // If we have remaining ads, append them after all posts
  while (feedAdIndex < feedAds.length) {
    merged.push({
      type: "sponsored-post",
      data: feedAds[feedAdIndex],
      trackImpression,
      trackClick,
    });
    feedAdIndex++;
    adsInserted++;
  }

  return merged;
};

/** Feed body: skeleton, error with retry, empty state, or posts with ads and "load more". */
const FeedPostList = ({
  posts,
  feedAds = [],
  loading,
  failed,
  hasMore,
  loadingMore,
  onRetry,
  onLoadMore,
  onReport,
  onEdit,
  onDelete,
  onTrackAdImpression,
  onTrackAdClick,
}) => {
  const authorIds = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post?.author?.id).filter((id) => typeof id === "string" && id)),
      ),
    [posts],
  );
  const { getStatus } = useUserPresence(authorIds);

  const mergedItems = useMemo(
    () => mergePostsWithAds(posts, feedAds, onTrackAdImpression, onTrackAdClick),
    [posts, feedAds, onTrackAdImpression, onTrackAdClick],
  );

  if (posts.length === 0) {
    if (loading) {
      return <CardSkeleton variant="feedPost" count={3} className="space-y-4" />;
    }
    if (failed) {
      return (
        <div className={messageClass}>
          <p>Couldn&apos;t load posts.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-semibold text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return (
      <p className={messageClass}>
        No posts yet. Be the first to share something with the community.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {mergedItems.map((item, idx) => {
        if (item.type === "post") {
          return (
            <FeedPost
              key={`post-${item.data.id}`}
              post={item.data}
              authorPresence={getStatus(item.data?.author?.id)}
              onReport={onReport}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        }
        if (item.type === "ad") {
          return (
            <FeedAdvertisementCard
              key={`ad-${item.data.id}`}
              ad={item.data}
              onTrackImpression={item.trackImpression}
              onTrackClick={item.trackClick}
            />
          );
        }
        if (item.type === "sponsored-post") {
          return (
            <FeedSponsoredPost
              key={`sponsored-${item.data.id}`}
              ad={item.data}
              onTrackImpression={item.trackImpression}
              onTrackClick={item.trackClick}
            />
          );
        }
        return null;
      })}
      {hasMore ? <LoadMorePosts onClick={onLoadMore} loading={loadingMore} /> : null}
    </div>
  );
};

export default FeedPostList;
