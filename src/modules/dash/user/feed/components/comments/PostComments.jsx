import { useState } from "react";
import ConfirmModal from "@/components/modals/common/ConfirmModal";
import { useCommentManagement } from "../../hooks/useCommentManagement";
import { useReplyComposer } from "../../hooks/useReplyComposer";
import { selectPreview } from "../../utils/commentTree";
import CommentComposer from "./CommentComposer";
import CommentThread from "./CommentThread";

const deleteDescription = (comment) =>
  comment?.replies?.length
    ? "This comment and its replies will be permanently removed. This action cannot be undone."
    : "This comment will be permanently removed. This action cannot be undone.";

/**
 * Comment section of a post. With `previewLimit` it shows only the first
 * comments plus a "See more comments" button that calls `onShowAll`.
 */
const PostComments = ({
  comments,
  currentUser,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
  likingCommentId,
  previewLimit,
  onShowAll,
  emptyText,
}) => {
  const [addedHere, setAddedHere] = useState(0);
  const reply = useReplyComposer(comments, onAddComment);
  const { manage, deletion } = useCommentManagement({
    onEditComment,
    onDeleteComment,
    onEditStart: reply.cancel,
    onDeleted: reply.closeIfInvolves,
  });

  const handleAddComment = async (text) => {
    const ok = await onAddComment(text);
    if (ok !== false) setAddedHere((count) => count + 1);
    return ok;
  };

  const visibleComments = selectPreview(comments, previewLimit, addedHere);
  const hasMore = visibleComments.length < comments.length;

  return (
    <div className="border-t border-[#E4E7EC] p-3 sm:p-4">
      <CommentComposer currentUser={currentUser} onSubmit={handleAddComment} />

      {comments.length === 0 && emptyText ? (
        <p className="py-6 text-center text-[13px] text-[#64748B]">{emptyText}</p>
      ) : null}

      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            likingCommentId={likingCommentId}
            onLike={onLikeComment}
            reply={reply}
            manage={manage}
          />
        ))}
      </div>

      {hasMore && onShowAll ? (
        <button
          type="button"
          onClick={onShowAll}
          aria-haspopup="dialog"
          className="mt-4 w-full rounded-lg border border-[#E4E7EC] py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-[#F9FAFB]"
        >
          See more comments
        </button>
      ) : null}

      <ConfirmModal
        open={Boolean(deletion.comment)}
        title="Delete comment?"
        description={deleteDescription(deletion.comment)}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deletion.deleting}
        onClose={deletion.close}
        onConfirm={deletion.confirm}
      />
    </div>
  );
};

export default PostComments;
