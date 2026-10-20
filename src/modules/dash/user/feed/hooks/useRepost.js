import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { repostPost, undoRepost } from "@/features/dash/user/feed";

/**
 * Repost / undo-repost for a post, plus why reposting is unavailable
 * (deleted original, or the viewer's own post).
 */
export function useRepost(post, viewerId) {
  const dispatch = useDispatch();
  const reposting = useSelector((state) => state.userFeed.repostingId === post.id);

  const originalAuthorId = post.isRepost ? post.sharedPost?.author?.id : post.author?.id;
  let unavailableReason = null;
  if (post.isRepost && !post.sharedPost) {
    unavailableReason = "The original post is no longer available";
  } else if (viewerId && originalAuthorId === viewerId) {
    unavailableReason = "You can't repost your own post";
  }

  const repost = async (caption) => {
    const result = await dispatch(repostPost({ postId: post.id, content: caption }));
    if (repostPost.fulfilled.match(result)) {
      toast.success("Reposted to your feed");
      return true;
    }
    toast.error(result.payload || "Failed to repost");
    return false;
  };

  const undo = async () => {
    const result = await dispatch(undoRepost({ postId: post.id }));
    if (undoRepost.fulfilled.match(result)) {
      toast.success("Repost removed");
      return true;
    }
    toast.error(result.payload || "Failed to undo repost");
    return false;
  };

  return { reposting, unavailableReason, repost, undo };
}
