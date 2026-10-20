import ConfirmModal from '@/components/modals/common/ConfirmModal';

const PostTitleDescription = ({ post }) => (
  <p className="text-[14px] leading-relaxed text-[#64748B]">
    This will permanently remove{' '}
    <span className="font-semibold text-deep-blue">{post.title || 'this post'}</span>. This
    action cannot be undone.
  </p>
);

/**
 * Confirms permanently deleting a post. Opens while `post` is set unless
 * `open` is given; without `description` it names the post's title.
 */
const DeletePostModal = ({
  post,
  open = Boolean(post),
  description,
  deleting,
  onClose,
  onConfirm,
}) => (
  <ConfirmModal
    open={open}
    title="Delete post?"
    description={description ?? (post ? <PostTitleDescription post={post} /> : null)}
    confirmLabel="Delete"
    cancelLabel="Cancel"
    confirming={deleting}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default DeletePostModal;
