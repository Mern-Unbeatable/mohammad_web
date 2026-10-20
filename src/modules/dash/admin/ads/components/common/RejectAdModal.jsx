import ReasonModal from "@/components/modals/admin/ReasonModal";
import { rejectDescription } from "../../utils/adRowActions";

/** Asks for a rejection reason; `title` is the ad being rejected (none while closed). */
const RejectAdModal = ({ open, title, onClose, onConfirm }) => (
  <ReasonModal
    open={open}
    title="Reject advertisement"
    submitLabel="Reject"
    placeholder="Why reject this advertisement?"
    description={title ? rejectDescription(title) : undefined}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default RejectAdModal;
