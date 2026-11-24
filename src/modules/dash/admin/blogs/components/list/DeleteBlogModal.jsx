import ConfirmModal from "@/components/modals/common/ConfirmModal";

/** Confirms deleting `article` (closed while it is null). */
const DeleteBlogModal = ({ article, deleting, onClose, onConfirm }) => (
  <ConfirmModal
    open={Boolean(article)}
    title="Delete blog post?"
    description={
      article ? (
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          This will permanently remove{" "}
          <span className="font-semibold text-deep-blue">{article.title || "this blog"}</span>
          . This action cannot be undone.
        </p>
      ) : null
    }
    confirmLabel="Delete"
    cancelLabel="Cancel"
    confirming={deleting}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default DeleteBlogModal;
