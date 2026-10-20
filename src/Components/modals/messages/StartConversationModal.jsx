import { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import ChatListingCard from "@/components/data-display/Messenger/ChatListingCard";
import { getApiErrorMessage } from "@/config";
import { toChatListingModel } from "@/features/messages";
import { START_CONVERSATION_MAX_LENGTH } from "@/modules/messages/constant/constants";
import { FormError, FormLabel, Textarea } from "@/components/form-controls";

/** Profile models fill missing fields with "—"; those are left out. */
const isShown = (value) =>
  typeof value === "string" && value.trim() !== "" && value.trim() !== "—";

/**
 * `onSend(message)` must resolve once the message is delivered (the caller
 * navigates away) or throw to keep the form open for a retry.
 */
const StartConversationForm = ({
  recipient,
  listing = null,
  title = "New message",
  description,
  placeholder = "Write your message...",
  onClose,
  onSend,
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sendingRef = useRef(false);

  const body = message.trim();
  const canSubmit = body.length > 0 && !sending;
  const subtitle = [recipient.title, recipient.company]
    .filter(isShown)
    .join(" · ");
  const listingCard = listing ? toChatListingModel(listing) : null;

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !sendingRef.current) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const dismiss = () => {
    if (!sendingRef.current) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sendingRef.current) return;
    if (!body) {
      setError("Write a message first.");
      return;
    }
    sendingRef.current = true;
    setSending(true);
    setError("");
    try {
      await onSend(body);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Could not send your message. Please try again.",
        ),
      );
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 sm:items-center sm:p-4"
      onClick={dismiss}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-conversation-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div>
            <h2
              id="start-conversation-title"
              className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
                {description}
              </p>
            ) : null}
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
            <Avatar
              src={recipient.avatar}
              alt={recipient.name}
              initials={recipient.initials}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-deep-blue">
                {recipient.name}
              </p>
              {subtitle ? (
                <p className="truncate text-[12px] text-[#64748B]">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {listingCard ? (
            <>
              <p className="mb-1.5 mt-5 text-[13px] font-semibold text-deep-blue">
                About this listing
              </p>
              <ChatListingCard listing={listingCard} className="!max-w-none" />
            </>
          ) : null}

          <FormLabel htmlFor="start-conversation-message" className="mt-5">
            Message<span className="text-pink-light"> *</span>
          </FormLabel>
          <Textarea
            id="start-conversation-message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError("");
            }}
            rows={4}
            maxLength={START_CONVERSATION_MAX_LENGTH}
            placeholder={placeholder}
            disabled={sending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "start-conversation-error" : undefined}
            className="disabled:bg-[#F9FAFB] resize-y"
          />

          <FormError id="start-conversation-error">{error}</FormError>

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
              {sending ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * First message to one person — from a profile, or about a marketplace
 * `listing` (raw API listing). Form state resets on every open because the
 * form remounts.
 */
const StartConversationModal = ({ open, ...props }) =>
  open ? <StartConversationForm {...props} /> : null;

export default StartConversationModal;
