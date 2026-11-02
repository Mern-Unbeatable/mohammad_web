import { MdThumbUpAlt, MdThumbUpOffAlt } from "react-icons/md";
import ExpandableText from "@/components/common/ExpandableText/ExpandableText";
import { COMMENT_LINES } from "../../constants";
import { MENTION_HIGHLIGHT } from "../../utils/mentions";
import OwnerActionsMenu from "../post/OwnerActionsMenu";
import CommentEditForm from "./CommentEditForm";
import InlineReplyBox from "./InlineReplyBox";

const Count = ({ value }) =>
  value > 0 ? <span className="tabular-nums font-normal">({value})</span> : null;

const CommentBubble = ({ comment, canEdit, canDelete, manage }) => (
  <div className="rounded-lg bg-[#F3F4F6] px-3 py-2.5">
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <p className="break-words text-[13px] font-semibold text-deep-blue">
          {comment.author?.name}
        </p>
        {comment.author?.subtitle ? (
          <p className="truncate text-[11px] text-[#64748B]">{comment.author.subtitle}</p>
        ) : null}
      </div>
      {canEdit || canDelete ? (
        <OwnerActionsMenu
          size="sm"
          label="Comment options"
          editLabel="Edit comment"
          deleteLabel="Delete comment"
          className="-mr-1.5 -mt-1"
          onEdit={canEdit ? () => manage.onStartEdit(comment) : undefined}
          onDelete={canDelete ? () => manage.onRequestDelete(comment) : undefined}
        />
      ) : null}
    </div>
    <ExpandableText
      text={comment.content}
      lines={COMMENT_LINES}
      highlight={MENTION_HIGHLIGHT}
      className="mt-1.5 text-[13px] leading-relaxed text-[#475467]"
    />
  </div>
);

const CommentFooter = ({ comment, liking, onLike, onReply }) => (
  <div className="mt-1 flex flex-wrap items-center gap-2 px-1 text-[12px] font-semibold text-[#64748B]">
    <span className="font-normal text-[#98A2B3]">{comment.time}</span>•
    <button
      type="button"
      onClick={() => onLike(comment.id)}
      disabled={liking}
      aria-pressed={Boolean(comment.liked)}
      className={`group flex gap-1 items-center hover:text-primary disabled:opacity-60 ${
        comment.liked ? "text-primary" : ""
      }`}
    >
      {comment.liked ? (
        <MdThumbUpAlt aria-hidden="true" className="h-4 w-4 text-primary" />
      ) : (
        <MdThumbUpOffAlt
          aria-hidden="true"
          className="h-4 w-4 text-gray-500 transition-colors group-hover:text-primary"
        />
      )}
      <Count value={comment.likeCount} />
    </button>
    •
    <button
      type="button"
      onClick={() => onReply(comment)}
      className="flex items-center gap-1 hover:text-primary"
    >
      Reply
      <Count value={comment.replies?.length} />
    </button>
  </div>
);

/**
 * A comment's bubble, actions and (when targeted) inline reply box.
 * `reply` comes from `useReplyComposer`, `manage` from `useCommentManagement`.
 */
const CommentBody = ({ comment, currentUser, liking, onLike, reply, manage }) => {
  const isOwner = Boolean(currentUser?.id && comment.author?.id === currentUser.id);
  const canEdit = isOwner && Boolean(manage?.onSaveEdit);
  const canDelete = isOwner && Boolean(manage?.onRequestDelete);

  if (manage?.editingId === comment.id) {
    return (
      <div className="min-w-0 flex-1">
        <CommentEditForm
          initialValue={comment.content}
          saving={manage.editSaving}
          onSave={(text) => manage.onSaveEdit(comment, text)}
          onCancel={manage.onCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <CommentBubble
        comment={comment}
        canEdit={canEdit}
        canDelete={canDelete}
        manage={manage}
      />
      <CommentFooter
        comment={comment}
        liking={liking}
        onLike={onLike}
        onReply={reply.toggle}
      />
      {reply.targetId === comment.id ? (
        <InlineReplyBox
          currentUser={currentUser}
          initialValue={reply.initialValue}
          submitting={reply.submitting}
          onSubmit={reply.submit}
          onCancel={reply.cancel}
        />
      ) : null}
    </div>
  );
};

export default CommentBody;
