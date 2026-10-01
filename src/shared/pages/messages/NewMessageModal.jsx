import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import ChatListingCard from '@/components/data-display/Messenger/ChatListingCard';
import RecipientPicker from '@/shared/pages/messages/RecipientPicker';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const NewMessageForm = ({
  onClose,
  onSend,
  recipients,
  recipientsLoading,
  onSearchRecipients,
  initialRecipientId,
  listing = null,
  onRemoveListing,
  submitting,
}) => {
  const [selected, setSelected] = useState(initialRecipientId ? [initialRecipientId] : []);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const recipientId = selected[0] || '';
  const listingId = listing && !listing.loading ? listing.id : undefined;
  const canSubmit =
    Boolean(recipientId) &&
    (message.trim().length > 0 || Boolean(listingId)) &&
    !listing?.loading &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const ok = await onSend?.({ recipientId, message: message.trim(), listingId });
    if (ok !== false) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-message-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div>
            <h2 id="new-message-title" className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
              New Message
            </h2>
            <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
              Send a message to someone in your network.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <div className="mb-4">
            <p className={labelClass}>
              Select User<span className="text-pink-light"> *</span>
            </p>
            <RecipientPicker
              recipients={recipients}
              loading={recipientsLoading}
              selected={selected}
              onChange={setSelected}
              onSearch={onSearchRecipients}
            />
          </div>

          <div>
            <label htmlFor="new-message-body" className={labelClass}>
              Message{listing ? null : <span className="text-pink-light"> *</span>}
            </label>
            {listing ? (
              <ChatListingCard listing={listing} onRemove={onRemoveListing} className="mb-2" />
            ) : null}
            <textarea
              id="new-message-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={5000}
              placeholder={
                listing ? 'Hi, is this still available?' : 'Write your message...'
              }
              className={`${fieldClass} resize-y`}
              required={!listing}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** Form state resets on every open because the form remounts. */
const NewMessageModal = ({ open, ...props }) =>
  open ? <NewMessageForm {...props} /> : null;

export default NewMessageModal;
