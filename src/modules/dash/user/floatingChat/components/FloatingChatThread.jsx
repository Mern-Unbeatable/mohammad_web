import { useEffect, useRef } from "react";
import { FileText, Loader2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import FormattedMessage from "@/components/data-display/Messenger/FormattedMessage";
import { isImageAttachment } from "@/features/messages";

const AttachmentList = ({ attachments = [], isMe }) => {
  if (!attachments.length) return null;
  return (
    <div className="mt-1.5 flex flex-col gap-1.5">
      {attachments.map((file, index) =>
        isImageAttachment(file) ? (
          <a
            key={`${file.url}-${index}`}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg"
          >
            <img
              src={file.url}
              alt={file.name}
              className="max-h-40 w-full object-cover"
              loading="lazy"
            />
          </a>
        ) : (
          <a
            key={`${file.url}-${index}`}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] ${
              isMe
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-[#E4E7EC] text-[#475467] hover:bg-[#F2F4F7]"
            }`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{file.name}</span>
          </a>
        ),
      )}
    </div>
  );
};

const Bubble = ({ message, recipient }) => {
  if (message.isSystem || message.isCall) {
    return (
      <div className="flex justify-center px-2">
        <span className="rounded-full bg-[#F2F4F7] px-3 py-1 text-[11px] text-[#64748B]">
          {message.isCall ? message.call?.label || "Voice call" : message.text}
        </span>
      </div>
    );
  }
  const isMe = message.from === "me";
  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe ? (
        <Avatar
          src={recipient?.avatar}
          alt={recipient?.name}
          initials={recipient?.initials}
          size="xs"
          className="mb-1"
        />
      ) : null}
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed [overflow-wrap:anywhere] ${
          isMe
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md bg-[#F2F4F7] text-[#0F172A]"
        }`}
      >
        {message.text ? (
          <FormattedMessage text={message.text} tone={isMe ? "me" : "them"} />
        ) : null}
        <AttachmentList attachments={message.attachments} isMe={isMe} />
        <span className={`mt-1 block text-[10px] ${isMe ? "text-white/70" : "text-[#98A2B3]"}`}>
          {message.time}
          {message.edited ? " · edited" : ""}
        </span>
      </div>
    </div>
  );
};

/** Scrollable message list for the floating popup. */
const FloatingChatThread = ({
  messages,
  recipient,
  loading,
  hasMore,
  olderLoading,
  onLoadOlder,
  otherTyping,
}) => {
  const bottomRef = useRef(null);
  const count = messages.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [count, otherTyping]);

  return (
    <div className="flex-1 space-y-2.5 overflow-y-auto bg-white px-3 py-3 scrollbar-hide">
      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadOlder}
            disabled={olderLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] px-3 py-1 text-[11px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
          >
            {olderLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Load older messages
          </button>
        </div>
      ) : null}

      {loading && count === 0 ? (
        <div className="flex h-full items-center justify-center text-[#98A2B3]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : count === 0 ? (
        <p className="py-8 text-center text-[12px] text-[#98A2B3]">
          No messages yet. Say hello!
        </p>
      ) : (
        messages.map((message) => (
          <Bubble key={message.id} message={message} recipient={recipient} />
        ))
      )}

      {otherTyping ? (
        <p className="px-1 text-[11px] italic text-[#98A2B3]">
          {recipient?.name?.split(" ")[0] || "They"} is typing…
        </p>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
};

export default FloatingChatThread;
