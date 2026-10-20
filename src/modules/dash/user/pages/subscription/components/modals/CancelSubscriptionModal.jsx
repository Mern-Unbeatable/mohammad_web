import { useEffect } from "react";
import { Loader2, X } from "lucide-react";

const CancelSubscriptionModal = ({
  open,
  isTrial,
  saving,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={saving ? undefined : onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-[440px] flex-col rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-subscription-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2
            id="cancel-subscription-title"
            className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
          >
            Cancel subscription?
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5 sm:px-5">
          <p className="text-[14px] leading-relaxed text-[#64748B]">
            {isTrial
              ? "Your free trial will end immediately. You can subscribe again anytime."
              : "Your membership will stay active until the end of the current billing period. You will not be charged again."}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E4E7EC] px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
