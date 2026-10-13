import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { MdThumbUpAlt, MdThumbUpOffAlt } from "react-icons/md";
import Avatar from "@/components/ui/Avatar";
import ExpandableText from "@/components/common/ExpandableText/ExpandableText";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { MENTION_HIGHLIGHT } from "./mentions";
import OwnerActionsMenu from "./OwnerActionsMenu";

const LINE = "bg-[#D0D5DD]";
const SPINE_X = 18;
const BRANCH_W = 30;
/** Matches the `pt-3` / `space-y-3` spacing between the comment and its replies. */
const THREAD_GAP = 12;
const VISIBLE_REPLIES = 2;
const COMMENT_LINES = 3;
/** Matches the server's comment length limit. */
const MAX_COMMENT_LENGTH = 2000;

const mentionFromName = (name = "") => {
  const first = String(name).trim().split(/\s+/)[0];
  return first ? `@${first}` : "@Member";
};

const InlineReplyBox = ({
  currentUser,
  initialValue = "",
  submitting,
  onSubmit,
  onCancel,
}) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, []);

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    const ok = await onSubmit(text);
    if (ok !== false) setDraft("");
  };

  return (
    <div className="mt-2 flex gap-2">
      <Avatar
        src={currentUser?.avatar}
        alt={currentUser?.name || "Member"}
        initials={currentUser?.initials || "MB"}
        size="sm"
        className="mt-1 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Write a reply..."
          disabled={submitting}
          className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2 text-[16px] text-deep-blue placeholder:text-[13px] sm:text-[13px] outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
        />
        <div className="mt-1.5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            {submitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentEditForm = ({ initialValue, saving, onSave, onCancel }) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useRef(null);
  const empty = !draft.trim();

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  const handleSave = () => {
    if (empty || saving) return;
    onSave(draft.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && !saving) {
      event.preventDefault();
      onCancel();
    } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  return (
    <div>
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={saving}
        aria-label="Edit comment"
        aria-invalid={empty}
        className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-[16px] text-deep-blue outline-none focus:ring-2 disabled:opacity-60 sm:text-[13px] ${
          empty
            ? "border-[#FDA29B] focus:border-[#F04438] focus:ring-[#F04438]/10"
            : "border-[#E4E7EC] focus:border-primary focus:ring-primary/10"
        }`}
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] text-[#98A2B3]">
          {empty ? (
            <span className="text-[#D92D20]">Comment can&apos;t be empty</span>
          ) : (
            <span className="hidden sm:inline">Esc to cancel</span>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={empty || saving}
            className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentBody = ({
  comment,
  onLike,
  onReply,
  liking,
  showInlineReply,
  currentUser,
  replyInitialValue,
  replySubmitting,
  onSubmitReply,
  onCancelReply,
  manage,
}) => {
  const isOwner = Boolean(
    currentUser?.id && comment.author?.id === currentUser.id,
  );
  const canEdit = isOwner && Boolean(manage?.onSaveEdit);
  const canDelete = isOwner && Boolean(manage?.onRequestDelete);
  const editing = manage?.editingId === comment.id;

  if (editing) {
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
      <div className="rounded-lg bg-[#F3F4F6] px-3 py-2.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="break-words text-[13px] font-semibold text-deep-blue">
              {comment.author?.name}
            </p>
            {comment.author?.subtitle ? (
              <p className="truncate text-[11px] text-[#64748B]">
                {comment.author.subtitle}
              </p>
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
              onDelete={
                canDelete ? () => manage.onRequestDelete(comment) : undefined
              }
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
          {/* {comment.liked ? "Liked" : "Like"} */}
          {comment.likeCount > 0 ? (
            <span className="tabular-nums font-normal">
              ({comment.likeCount})
            </span>
          ) : null}
        </button>
        •
        <button
          type="button"
          onClick={() => onReply(comment)}
          className="flex items-center gap-1 hover:text-primary"
        >
          Reply
          {comment.replies?.length > 0 ? (
            <span className="tabular-nums font-normal">
              ({comment.replies.length})
            </span>
          ) : null}
        </button>
      </div>

      {showInlineReply ? (
        <InlineReplyBox
          currentUser={currentUser}
          initialValue={replyInitialValue}
          submitting={replySubmitting}
          onSubmit={onSubmitReply}
          onCancel={onCancelReply}
        />
      ) : null}
    </div>
  );
};

const CommentItem = ({
  comment,
  currentUser,
  onLike,
  onReply,
  likingCommentId,
  showAllReplies,
  onToggleMoreReplies,
  replyTargetId,
  replyInitialValue,
  replySubmitting,
  onSubmitReply,
  onCancelReply,
  manage,
}) => {
  const nested = Array.isArray(comment.replies) ? comment.replies : [];
  const hasMore = nested.length > VISIBLE_REPLIES;
  const visibleReplies = showAllReplies
    ? nested
    : nested.slice(0, VISIBLE_REPLIES);
  const hiddenCount = Math.max(0, nested.length - VISIBLE_REPLIES);
  const showThread = nested.length > 0;
  const replyOpenOnRoot = replyTargetId === comment.id;

  return (
    <div className="relative">
      <div className="relative z-[1] flex gap-3">
        {showThread || replyOpenOnRoot ? (
          <span
            className={`pointer-events-none absolute bottom-0 top-10 z-0 w-px -translate-x-1/2 ${LINE}`}
            style={{ left: SPINE_X }}
            aria-hidden
          />
        ) : null}
        <div className="relative z-10 w-9 shrink-0 self-start rounded-full bg-white">
          <Avatar
            src={comment.author?.avatar}
            alt={comment.author?.name}
            initials={comment.author?.initials}
            size="sm"
          />
        </div>
        <CommentBody
          comment={comment}
          onLike={onLike}
          onReply={onReply}
          liking={likingCommentId === comment.id}
          showInlineReply={replyOpenOnRoot}
          currentUser={currentUser}
          replyInitialValue={replyInitialValue}
          replySubmitting={replySubmitting}
          onSubmitReply={onSubmitReply}
          onCancelReply={onCancelReply}
          manage={manage}
        />
      </div>

      {showThread ? (
        <div className="relative space-y-2 pt-3">
          {visibleReplies.map((reply, index) => {
            const isLastVisible = index === visibleReplies.length - 1;
            const replyOpen = replyTargetId === reply.id;

            return (
              <div key={reply.id} className="relative">
                <span
                  className={`pointer-events-none absolute z-0 w-px -translate-x-1/2 ${LINE}`}
                  style={{
                    left: SPINE_X,
                    top: -THREAD_GAP,
                    ...(isLastVisible
                      ? { height: THREAD_GAP + SPINE_X }
                      : { bottom: 0 }),
                  }}
                  aria-hidden
                />
                <span
                  className={`pointer-events-none absolute z-0 h-px ${LINE}`}
                  style={{ left: SPINE_X, top: SPINE_X, width: BRANCH_W }}
                  aria-hidden
                />
                <div className="flex gap-3" style={{ paddingLeft: BRANCH_W }}>
                  <div className="relative z-10 w-9 shrink-0 self-start rounded-full bg-white">
                    <Avatar
                      src={reply.author?.avatar}
                      alt={reply.author?.name}
                      initials={reply.author?.initials}
                      size="sm"
                    />
                  </div>
                  <CommentBody
                    comment={reply}
                    onLike={onLike}
                    onReply={onReply}
                    liking={likingCommentId === reply.id}
                    showInlineReply={replyOpen}
                    currentUser={currentUser}
                    replyInitialValue={replyInitialValue}
                    replySubmitting={replySubmitting}
                    onSubmitReply={onSubmitReply}
                    onCancelReply={onCancelReply}
                    manage={manage}
                  />
                </div>
              </div>
            );
          })}

          {hasMore ? (
            <div
              className="relative"
              style={{ paddingLeft: BRANCH_W + 36 + 12 }}
            >
              <button
                type="button"
                onClick={() => onToggleMoreReplies(comment.id)}
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                {showAllReplies
                  ? "Hide replies"
                  : `View ${hiddenCount} more ${
                      hiddenCount === 1 ? "reply" : "replies"
                    }`}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const countAll = (list = []) =>
  list.reduce(
    (sum, c) => sum + 1 + (Array.isArray(c.replies) ? c.replies.length : 0),
    0,
  );

/**
 * The oldest `limit` top-level comments, plus the newest `pinned` ones so a
 * comment just posted from the preview doesn't vanish past the cut.
 */
const selectPreview = (comments, limit, pinned = 0) => {
  if (!limit || comments.length <= limit) return comments;
  const tailStart = Math.max(limit, comments.length - pinned);
  return [...comments.slice(0, limit), ...comments.slice(tailStart)];
};

const findRootId = (comments, commentId) => {
  for (const root of comments || []) {
    if (root.id === commentId) return root.id;
    if (
      Array.isArray(root.replies) &&
      root.replies.some((r) => r.id === commentId)
    ) {
      return root.id;
    }
  }
  return commentId;
};

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
  const [draft, setDraft] = useState("");
  const [addedHere, setAddedHere] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyRootId, setReplyRootId] = useState(null);
  const [replyInitialValue, setReplyInitialValue] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showAllByRoot, setShowAllByRoot] = useState(() => new Set());

  const handleTopSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onAddComment(text);
      if (ok !== false) {
        setDraft("");
        setAddedHere((count) => count + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    if (replyTargetId === comment.id) {
      setReplyTargetId(null);
      setReplyRootId(null);
      setReplyInitialValue("");
      return;
    }

    const rootId = findRootId(comments, comment.id);
    const isLevel1 = rootId !== comment.id;
    const root = comments.find((c) => c.id === rootId);
    const replyCount = root?.replies?.length ?? 0;

    setReplyTargetId(comment.id);
    setReplyRootId(rootId);
    setReplyInitialValue(
      isLevel1 ? `${mentionFromName(comment?.author?.name)} ` : "",
    );

    // Ensure target reply is visible if it's beyond the collapsed ones
    if (isLevel1 && replyCount > VISIBLE_REPLIES) {
      const index = root.replies.findIndex((r) => r.id === comment.id);
      if (index >= VISIBLE_REPLIES) {
        setShowAllByRoot((prev) => new Set(prev).add(rootId));
      }
    }
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
    setReplyRootId(null);
    setReplyInitialValue("");
  };

  const handleSubmitReply = async (text) => {
    if (!text?.trim() || replySubmitting || !replyRootId) return false;
    setReplySubmitting(true);
    try {
      const ok = await onAddComment(text, replyRootId);
      if (ok !== false) {
        const root = comments.find((c) => c.id === replyRootId);
        const nextCount = (root?.replies?.length ?? 0) + 1;
        if (nextCount > VISIBLE_REPLIES) {
          setShowAllByRoot((prev) => new Set(prev).add(replyRootId));
        }
        handleCancelReply();
      }
      return ok;
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleSaveEdit = async (comment, text) => {
    if (editSaving) return;
    if (text === comment.content.trim()) {
      setEditingId(null);
      return;
    }
    setEditSaving(true);
    try {
      const ok = await onEditComment(comment.id, text);
      if (ok !== false) setEditingId(null);
    } finally {
      setEditSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      const ok = await onDeleteComment(target.id);
      if (ok === false) return;
      setPendingDelete(null);
      if (editingId === target.id) setEditingId(null);
      if (replyTargetId === target.id || replyRootId === target.id) {
        handleCancelReply();
      }
    } finally {
      setDeleting(false);
    }
  };

  const manage = {
    editingId,
    editSaving,
    onStartEdit: (comment) => {
      handleCancelReply();
      setEditingId(comment.id);
    },
    onCancelEdit: () => setEditingId(null),
    onSaveEdit: onEditComment ? handleSaveEdit : undefined,
    onRequestDelete: onDeleteComment ? setPendingDelete : undefined,
  };

  const visibleComments = selectPreview(comments, previewLimit, addedHere);
  const hasMore = visibleComments.length < comments.length;

  const handleToggleMoreReplies = (commentId) => {
    setShowAllByRoot((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  return (
    <div className="border-t border-[#E4E7EC] p-3 sm:p-4">
      {/* <p className="mb-4 text-[14px] font-bold text-deep-blue">
        Comments ({countAll(comments)})
      </p> */}

      <div className="mb-4 flex gap-2.5 sm:gap-3">
        <Avatar
          src={currentUser?.avatar}
          alt={currentUser?.name || "Member"}
          initials={currentUser?.initials || "MB"}
          size="md"
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Add a professional comment..."
            disabled={submitting}
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[16px] text-deep-blue placeholder:text-[13px] sm:text-[13px] outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleTopSubmit}
              disabled={!draft.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      </div>

      {comments.length === 0 && emptyText ? (
        <p className="py-6 text-center text-[13px] text-[#64748B]">
          {emptyText}
        </p>
      ) : null}

      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onLike={onLikeComment}
            onReply={handleReply}
            likingCommentId={likingCommentId}
            showAllReplies={showAllByRoot.has(comment.id)}
            onToggleMoreReplies={handleToggleMoreReplies}
            replyTargetId={replyTargetId}
            replyInitialValue={replyInitialValue}
            replySubmitting={replySubmitting}
            onSubmitReply={handleSubmitReply}
            onCancelReply={handleCancelReply}
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
        open={Boolean(pendingDelete)}
        title="Delete comment?"
        description={
          pendingDelete?.replies?.length
            ? "This comment and its replies will be permanently removed. This action cannot be undone."
            : "This comment will be permanently removed. This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PostComments;
