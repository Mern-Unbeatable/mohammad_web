import ConfirmModal from "@/components/modals/common/ConfirmModal";

/** Confirm dialogs for removing one message and deleting a whole conversation. */
const RemovalModals = ({ removal }) => (
  <>
    <ConfirmModal
      open={removal.messageOpen}
      title="Remove message?"
      description="The message will be deleted for every participant."
      confirmLabel="Remove"
      confirming={removal.deleting}
      onClose={removal.closeMessage}
      onConfirm={removal.confirmMessage}
    />
    <ConfirmModal
      open={removal.conversationOpen}
      title="Delete conversation?"
      description="All messages in this conversation will be permanently deleted for every participant."
      confirmLabel="Delete"
      confirming={removal.deleting}
      onClose={removal.closeConversation}
      onConfirm={removal.confirmConversation}
    />
  </>
);

export default RemovalModals;
