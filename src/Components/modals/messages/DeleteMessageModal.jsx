import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';

const DeleteMessageModal = ({ open, onClose, onConfirm }) => (
  <ConfirmModal
    open={open}
    title="Delete message?"
    description="This removes the message for everyone in the conversation."
    confirmLabel="Delete"
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default DeleteMessageModal;
