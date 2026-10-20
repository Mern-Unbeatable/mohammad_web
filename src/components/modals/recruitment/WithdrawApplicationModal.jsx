import ConfirmModal from "@/components/modals/common/ConfirmModal";

/** Confirms withdrawing one of the caller's applications. */
const WithdrawApplicationModal = ({ application, withdrawing, onClose, onConfirm }) => (
  <ConfirmModal
    open={Boolean(application)}
    title="Cancel application?"
    description={
      application ? (
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          Your application for{" "}
          <span className="font-semibold text-deep-blue">
            {application.job?.title || "this job"}
          </span>{" "}
          will be withdrawn and the employer will no longer see it. You can apply again
          while the job is open.
        </p>
      ) : null
    }
    confirmLabel="Cancel application"
    cancelLabel="Keep"
    confirming={withdrawing}
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default WithdrawApplicationModal;
