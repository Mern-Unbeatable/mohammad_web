import { X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";
import { MAX_POST_LENGTH } from "@/modules/dash/user/feed/constants";
import { usePostDraft } from "@/modules/dash/user/feed/hooks/usePostDraft";
import { DEFAULT_POST_OPTION } from "@/modules/dash/user/feed/utils/postTypeOptions";
import ComposerFooter from "@/modules/dash/user/feed/components/composer/ComposerFooter";
import DraftDocumentCard from "@/modules/dash/user/feed/components/composer/DraftDocumentCard";
import DraftImageGrid from "@/modules/dash/user/feed/components/composer/DraftImageGrid";
import PostTypeChips from "@/modules/dash/user/feed/components/composer/PostTypeChips";

const ComposerHeader = ({ user, title, busy, onClose }) => {
  const displayName = user?.name || "You";

  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#E4E7EC] bg-white px-4 py-3 sm:px-5">
      <h2 id="create-post-title" className="sr-only">
        {title}
      </h2>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar src={user?.avatar} alt={displayName} initials={user?.initials || "U"} size="md" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-deep-blue">{displayName}</p>
          {user?.company ? (
            <p className="truncate text-[12px] text-[#64748B]">{user.company}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        disabled={busy}
        className="shrink-0 rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const PostComposerDialog = ({
  onClose,
  user,
  onPublish,
  submitting,
  initialOption,
  mode,
  post,
}) => {
  const isEdit = mode === "edit" && Boolean(post);
  const isRepostEdit = isEdit && Boolean(post.isRepost);
  const draft = usePostDraft({
    post,
    isEdit,
    isRepostEdit,
    initialOption,
    submitting,
    onPublish,
  });
  useBodyScrollLock();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 sm:items-center sm:p-4"
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <ComposerHeader
          user={user}
          title={isEdit ? "Edit Post" : "Create Post"}
          busy={draft.busy}
          onClose={onClose}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {isEdit ? null : (
            <PostTypeChips
              value={draft.postOption}
              onChange={draft.setPostOption}
              disabled={draft.busy}
            />
          )}

          <textarea
            value={draft.content}
            onChange={(e) => draft.setContent(e.target.value)}
            rows={5}
            maxLength={MAX_POST_LENGTH}
            disabled={draft.busy}
            aria-label={isRepostEdit ? "Caption" : "Post content"}
            placeholder={
              isRepostEdit
                ? "Add a caption (optional)"
                : "Write something useful for the laboratory community..."
            }
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:px-4 sm:py-3"
          />

          {draft.hasImage ? (
            <DraftImageGrid
              images={draft.images}
              disabled={draft.busy}
              onRemove={draft.removeImage}
            />
          ) : null}

          {draft.shownDocument ? (
            <DraftDocumentCard
              document={draft.shownDocument}
              disabled={draft.busy}
              onRemove={draft.removeDocument}
            />
          ) : null}
        </div>

        <ComposerFooter draft={draft} onClose={onClose} />
      </div>
    </div>
  );
};

/**
 * Create / edit post dialog. The dialog only mounts while `open`, so every
 * opening starts from a fresh draft (or the edited post's current values).
 */
const CreatePostModal = ({
  open,
  submitting = false,
  initialOption = DEFAULT_POST_OPTION,
  mode = "create",
  post = null,
  ...props
}) =>
  open ? (
    <PostComposerDialog
      {...props}
      submitting={submitting}
      initialOption={initialOption}
      mode={mode}
      post={post}
    />
  ) : null;

export default CreatePostModal;
