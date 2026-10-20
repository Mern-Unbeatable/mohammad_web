import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Link2, Loader2, Repeat2, Send, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { messagesApi } from "@/features/messages";
import { RecipientPicker } from "@/shared/pages/messages";
import { MAX_POST_LENGTH } from "../../constants";

const shareOptions = [
  {
    id: "repost",
    label: "Repost to your feed",
    icon: Repeat2,
    color: "text-primary",
  },
  {
    id: "copy",
    label: "Copy link to post",
    icon: Link2,
    color: "text-[#475467]",
  },
];

const SharePostModal = ({
  open,
  post,
  onClose,
  shared = false,
  reposting = false,
  repostUnavailableReason = null,
  onRepost,
  onUndoRepost,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [composing, setComposing] = useState(false);
  const [caption, setCaption] = useState("");
  const latestSearch = useRef(0);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const closeAfter = (ms) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(onClose, ms);
  };

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    setCopied(false);
    setSentTo(null);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const loadRecipients = useCallback(async (search) => {
    const requestId = ++latestSearch.current;
    setRecipientsLoading(true);
    try {
      const data = await messagesApi.getRecipients({ search });
      if (requestId === latestSearch.current) setRecipients(data);
    } catch (error) {
      if (requestId === latestSearch.current) {
        setRecipients([]);
        toast.error(
          messagesApi.getApiErrorMessage(error, "Failed to load contacts"),
        );
      }
    } finally {
      if (requestId === latestSearch.current) setRecipientsLoading(false);
    }
  }, []);

  if (!open || !post) return null;

  const postUrl = `${window.location.origin}/feed?post=${post.id}`;
  const selectedRecipient =
    recipients.find((r) => r.id === selectedIds[0]) || null;
  const busy = sending || reposting;
  const preview = post.isRepost && post.sharedPost ? post.sharedPost : post;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      toast.error("Couldn't copy the link");
      return;
    }
    setCopied(true);
    closeAfter(1200);
  };

  const handleRepostOption = async () => {
    if (busy) return;
    if (shared) {
      if (await onUndoRepost?.()) onClose();
      return;
    }
    setComposing((prev) => !prev);
  };

  const handleSubmitRepost = async () => {
    if (busy) return;
    if (await onRepost?.(caption.trim())) onClose();
  };

  const handleSend = async () => {
    if (!selectedRecipient || sending) return;
    setSending(true);
    try {
      await messagesApi.startDirect({
        participantId: selectedRecipient.id,
        message: `Shared a post with you: ${postUrl}`,
      });
      setSentTo(selectedRecipient.name);
      closeAfter(1400);
    } catch (error) {
      toast.error(messagesApi.getApiErrorMessage(error, "Failed to send post"));
    } finally {
      setSending(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 sm:items-center sm:p-4"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[580px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-2 sm:px-5 sm:py-3">
          <div>
            <h2
              id="share-post-title"
              className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
            >
              Share this post
            </h2>
            <p className="line-clamp-2 text-[13px] text-[#64748B]">
              <span className="font-semibold text-deep-blue">
                {preview.author.name}
              </span>
              {" · "}
              {preview.content.slice(0, 50)}
              {preview.content.length > 50 ? "…" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5">
          {copied && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-secondary px-3 py-2.5 text-[13px] font-medium text-green-primary">
              <Check className="h-4 w-4" />
              Link copied to clipboard
            </div>
          )}

          {sentTo && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-[13px] font-medium text-primary">
              <Check className="h-4 w-4" />
              Sent to {sentTo}
            </div>
          )}

          <div className="mb-4 space-y-1">
            {shareOptions.map(({ id, label, icon, color }) => {
              const Icon = icon;
              const isRepost = id === "repost";
              const unavailable =
                isRepost && !shared ? repostUnavailableReason : null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={isRepost ? handleRepostOption : handleCopy}
                  disabled={(isRepost && busy) || Boolean(unavailable)}
                  aria-expanded={isRepost && !shared ? composing : undefined}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] ${color}`}
                  >
                    {isRepost && reposting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium text-deep-blue">
                      {isRepost && shared ? "Undo repost" : label}
                    </span>
                    {unavailable ? (
                      <span className="block text-[12px] text-[#98A2B3]">
                        {unavailable}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {composing && !shared && !repostUnavailableReason ? (
            <div className="mb-5 rounded-lg border border-[#E4E7EC] p-3">
              <label htmlFor="repost-caption" className="sr-only">
                Repost caption
              </label>
              <textarea
                id="repost-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={MAX_POST_LENGTH}
                rows={3}
                disabled={reposting}
                placeholder="Say something about this (optional)"
                className="w-full resize-none rounded-md border border-[#E4E7EC] px-3 py-2 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary disabled:bg-[#F9FAFB]"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#98A2B3]">
                  {caption.length}/{MAX_POST_LENGTH}
                </span>
                <button
                  type="button"
                  onClick={handleSubmitRepost}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reposting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Repeat2 className="h-4 w-4" />
                  )}
                  {reposting ? "Reposting…" : "Repost now"}
                </button>
              </div>
            </div>
          ) : null}

          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Send to connections
          </p>
          <RecipientPicker
            recipients={recipients}
            loading={recipientsLoading}
            selected={selectedIds}
            onChange={setSelectedIds}
            onSearch={loadRecipients}
          />
        </div>

        <div className="flex shrink-0 gap-3 border-t border-[#E4E7EC] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-4 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-md border border-[#E4E7EC] py-2.5 text-[14px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!selectedRecipient || sending || Boolean(sentTo)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SharePostModal;
