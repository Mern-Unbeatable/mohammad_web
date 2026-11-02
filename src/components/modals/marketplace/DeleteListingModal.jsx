import ConfirmModal from '@/components/modals/common/ConfirmModal';

const DeleteListingModal = ({ listing, deleting, onClose, onConfirm }) => (
  <ConfirmModal
    open={Boolean(listing)}
    title="Delete listing?"
    description={
      listing ? (
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          This will permanently remove{' '}
          <span className="font-semibold text-deep-blue">{listing.title || 'this listing'}</span>.
          This action cannot be undone.
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

export default DeleteListingModal;
