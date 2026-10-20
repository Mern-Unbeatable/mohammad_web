import { LogOut } from 'lucide-react';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';

const LeaveGroupModal = ({ open, confirming, onClose, onConfirm }) => (
  <ConfirmModal
    open={open}
    title="Leave group?"
    description="You will stop receiving messages from this group. Rejoining requires the owner to add you again."
    confirmLabel="Leave"
    confirmIcon={LogOut}
    confirming={confirming}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default LeaveGroupModal;
