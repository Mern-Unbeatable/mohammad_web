import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';

const DeletePostModal = ({ post, deleting, onClose, onConfirm }) => (
  <ConfirmModal
    open={Boolean(post)}
    title="Delete post?"
    description={
      post ? (
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          This will permanently remove{' '}
          <span className="font-semibold text-deep-blue">{post.title || 'this post'}</span>. This
          action cannot be undone.
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

export default DeletePostModal;
