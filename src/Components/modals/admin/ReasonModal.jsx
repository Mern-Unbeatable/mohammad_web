import { useState } from 'react';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { X } from 'lucide-react';
import { Textarea } from '@/components/form-controls';

const ReasonModal = ({
  open,
  title,
  submitLabel = 'Confirm',
  placeholder = 'Enter reason…',
  description,
  onClose,
  onConfirm,
  submitClassName = 'bg-pink-light hover:opacity-90',
}) => {
  const [reason, setReason] = useState('');
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setReason('');
  }

  useBodyScrollLock(open);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm?.(reason.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-start sm:overflow-y-auto sm:p-4 sm:pt-[12vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reason-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 id="reason-modal-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-4 py-5 sm:px-5">
            {description ? (
              <p className="mb-4 text-[14px] text-[#64748B]">{description}</p>
            ) : null}
            <label htmlFor="reason-modal-input" className="mb-1.5 block text-[14px] font-medium text-deep-blue">
              Reason <span className="text-pink-light">*</span>
            </label>
            <Textarea
              variant="editor"
              id="reason-modal-input"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={placeholder}
              required
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-[#E4E7EC] px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D0D5DD] bg-white px-4 py-2.5 text-[13px] font-semibold text-deep-blue transition-colors hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-colors ${submitClassName}`}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReasonModal;
