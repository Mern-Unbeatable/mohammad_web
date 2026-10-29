import { useMemo } from "react";
import { CardSkeleton } from "@/components/loader";
import { useUserPresence } from "@/features/messages";
import FeedPost from "./post/FeedPost";
import LoadMorePosts from "./LoadMorePosts";

const messageClass =
  "rounded-xl border border-[#E4E7EC] bg-white px-4 py-10 text-center text-[14px] text-[#64748B]";

/** Feed body: skeleton, error with retry, empty state, or posts with "load more". */
const FeedPostList = ({
  posts,
  loading,
  failed,
  hasMore,
  loadingMore,
  onRetry,
  onLoadMore,
  onReport,
  onEdit,
  onDelete,
}) => {
  const authorIds = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post?.author?.id).filter((id) => typeof id === "string" && id)),
      ),
    [posts],
  );
  const { getStatus } = useUserPresence(authorIds);

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
      {posts.map((post) => (
        <FeedPost
          key={post.id}
          post={post}
          authorPresence={getStatus(post?.author?.id)}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {hasMore ? <LoadMorePosts onClick={onLoadMore} loading={loadingMore} /> : null}
    </div>
  );
};

export default FeedPostList;
