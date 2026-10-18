import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, Send, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ChatListingCard from '@/components/data-display/Messenger/ChatListingCard';
import { getApiErrorMessage } from '@/api';
import { toChatListingModel } from '@/features/messages';

export const CONTACT_SELLER_MAX_LENGTH = 5000;

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-[#F9FAFB]';

/**
 * `onSend(message)` must resolve once the message is delivered (the caller
 * navigates away) or throw to keep the form open for a retry.
 */
const ContactSellerForm = ({ listing, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const sendingRef = useRef(false);

  const body = message.trim();
  const canSubmit = body.length > 0 && !sending;
  const seller = listing.seller;
  const subtitle = [seller.title, seller.company].filter((v) => v && v !== '—').join(' · ');

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !sendingRef.current) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const dismiss = () => {
    if (!sendingRef.current) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sendingRef.current) return;
    if (!body) {
      setError('Write a message to the seller.');
      return;
    }
    sendingRef.current = true;
    setSending(true);
    setError('');
    try {
      await onSend(body);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not send your message. Please try again.'));
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={dismiss}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-seller-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div>
            <h2
              id="contact-seller-title"
              className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
            >
              Contact seller
            </h2>
            <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
              Ask {seller.name} about this listing.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            disabled={sending}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          noValidate
        >
          <div className="flex items-center gap-3">
            <Avatar src={seller.avatar} alt={seller.name} initials={seller.initials} size="md" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-deep-blue">{seller.name}</p>
              {subtitle ? (
                <p className="truncate text-[12px] text-[#64748B]">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <p className="mb-1.5 mt-5 text-[13px] font-semibold text-deep-blue">About this listing</p>
          <ChatListingCard listing={toChatListingModel(listing.raw)} className="!max-w-none" />

          <label
            htmlFor="contact-seller-message"
            className="mb-1.5 mt-5 block text-[13px] font-semibold text-deep-blue"
          >
            Message<span className="text-pink-light"> *</span>
          </label>
          <textarea
            id="contact-seller-message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError('');
            }}
            rows={4}
            maxLength={CONTACT_SELLER_MAX_LENGTH}
            placeholder="Hi, is this still available?"
            disabled={sending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-seller-error' : undefined}
            className={`${fieldClass} resize-y`}
          />

          {error ? (
            <p
              id="contact-seller-error"
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-[13px] text-[#CC1016]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={dismiss}
              disabled={sending}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** Form state resets on every open because the form remounts. */
const ContactSellerModal = ({ open, ...props }) =>
  open ? <ContactSellerForm {...props} /> : null;

export default ContactSellerModal;
