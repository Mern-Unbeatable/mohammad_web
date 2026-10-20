import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  addComment,
  editComment,
  likeComment,
  removeComment as removeCommentThunk,
} from "@/features/dash/user/feed";
import { findComment, removeComment, updateComment } from "../utils/commentTree";

/**
 * Comment add / like / edit / delete for one post. Each handler resolves to
 * `true` on success so the comment UI can clear or keep its input.
 */
export function usePostCommentActions(postId, { comments, setComments, setStats }) {
  const dispatch = useDispatch();

  const add = async (text, parentCommentId) => {
    const result = await dispatch(
      addComment({ postId, body: text, parentCommentId: parentCommentId || undefined }),
    );
    if (addComment.fulfilled.match(result)) return true;
    toast.error(result.payload || "Failed to add comment");
    return false;
  };

  const like = async (commentId) => {
    const previous = findComment(comments, commentId);
    if (!previous) return;

    const liked = !previous.liked;
    setComments((list) =>
      updateComment(list, commentId, (comment) => ({
        ...comment,
        liked,
        likeCount: Math.max(0, (comment.likeCount ?? 0) + (liked ? 1 : -1)),
      })),
    );

    const result = await dispatch(likeComment({ postId, commentId }));
    if (likeComment.rejected.match(result)) {
      setComments((list) => updateComment(list, commentId, () => previous));
      toast.error(result.payload || "Failed to like comment");
      return;
    }

    const data = result.payload?.data;
    if (!data) return;
    setComments((list) =>
      updateComment(list, commentId, (comment) => ({
        ...comment,
        liked: Boolean(data.liked ?? data.isLiked),
        likeCount: data.likeCount ?? comment.likeCount ?? 0,
      })),
    );
  };

  const edit = async (commentId, text) => {
    const result = await dispatch(editComment({ postId, commentId, body: text }));
    if (editComment.rejected.match(result)) {
      toast.error(result.payload || "Failed to update comment");
      return false;
    }
    const content = result.payload?.comment?.content ?? text.trim();
    setComments((list) =>
      updateComment(list, commentId, (comment) => ({ ...comment, content })),
    );
    return true;
  };

  const remove = async (commentId) => {
    const result = await dispatch(removeCommentThunk({ postId, commentId }));
    if (removeCommentThunk.rejected.match(result)) {
      toast.error(result.payload || "Failed to delete comment");
      return false;
    }

    const { removedCount } = removeComment(comments, commentId);
    setComments((list) => removeComment(list, commentId).comments);
    const serverCount = result.payload?.data?.commentCount;
    setStats((stats) => ({
      ...stats,
      comments:
        typeof serverCount === "number"
          ? serverCount
          : Math.max(0, (stats?.comments ?? 0) - removedCount),
    }));
    toast.success("Comment deleted");
    return true;
  };

  return { add, like, edit, remove };
}
