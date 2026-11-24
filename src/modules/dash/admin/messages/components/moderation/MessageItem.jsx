import { FileText, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import FormattedMessage from "@/components/data-display/Messenger/FormattedMessage";
import { formatBubbleTime, formatEventTime, isImageAttachment } from "@/features/messages";
import { isSystemMessage } from "../../utils/moderation";

const SystemMessage = ({ message }) => (
  <div className="flex flex-col items-center px-2 py-1.5 text-center" role="note">
    <p className="max-w-[90%] rounded-2xl bg-[#F2F4F7] px-3.5 py-1.5 text-[12px] text-[#475467] break-words">
      {message.body}
    </p>
    <span className="mt-1 text-[10px] text-[#98A2B3]">{formatEventTime(message.time)}</span>
  </div>
);

/** A system note, or a member message with attachments and a Remove button. */
const MessageItem = ({ message, onRemove }) => {
  if (isSystemMessage(message)) return <SystemMessage message={message} />;

  return (
    <div className="group flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[#F9FAFB]">
      <Avatar
        src={message.senderAvatar}
        alt={message.sender}
        initials={message.senderInitials}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[12px]">
          <span className="font-semibold text-deep-blue">{message.sender}</span>
          <span className="ml-2 text-[#98A2B3]">{formatBubbleTime(message.time)}</span>
        </p>
        {message.body ? (
          <div className="mt-0.5 space-y-1.5 break-words text-[13px] text-[#334155]">
            <FormattedMessage text={message.body} tone="plain" />
          </div>
        ) : null}
        {message.attachments?.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] px-2 py-1 text-[12px] text-primary hover:bg-white"
              >
                {isImageAttachment(attachment) ? null : <FileText className="h-3.5 w-3.5" />}
                {attachment.name}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onRemove(message.id)}
        aria-label={message.sender ? `Remove message from ${message.sender}` : "Remove message"}
        title="Remove message"
        className="rounded-md p-1.5 text-[#98A2B3] opacity-0 transition-opacity hover:bg-[#FEF3F2] hover:text-[#CC1016] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC1016]/40 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MessageItem;
