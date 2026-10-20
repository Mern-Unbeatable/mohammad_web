import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";

/** Confirms permanently deleting one of the user's posts. */
const DeletePostModal = ({ open, deleting, onClose, onConfirm }) => (
  <ConfirmModal
    open={open}
    title="Delete post?"
    description="This will permanently remove this post, including its comments and reactions. This action cannot be undone."
    confirmLabel="Delete"
    cancelLabel="Cancel"
    confirming={deleting}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default DeletePostModal;
