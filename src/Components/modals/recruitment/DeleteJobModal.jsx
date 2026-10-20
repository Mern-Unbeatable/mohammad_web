import ConfirmModal from "@/components/modals/common/ConfirmModal";

/** Confirms permanently deleting one of the caller's job posts. */
const DeleteJobModal = ({ job, deleting, onClose, onConfirm }) => (
  <ConfirmModal
    open={Boolean(job)}
    title="Delete job post?"
    description={
      job ? (
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          This will permanently remove{" "}
          <span className="font-semibold text-deep-blue">{job.title || "this job"}</span>
          {job.company ? (
            <>
              {" "}
              at <span className="font-semibold text-deep-blue">{job.company}</span>
            </>
          ) : null}
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

export default DeleteJobModal;
