import { MessageSquare, Users } from "lucide-react";
import { formatMessageTime } from "@/features/messages";
import { countLabel } from "../../utils/moderation";

/** One row in the moderation list: icon, name, time, preview, member / message counts. */
const ConversationItem = ({ conversation, active, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(conversation.id)}
    className={`flex w-full items-start gap-3 border-b border-[#F2F4F7] px-4 py-3 text-left ${
      active ? "bg-secondary" : "hover:bg-[#F9FAFB]"
    }`}
  >
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F3FB] text-primary">
      {conversation.isGroup ? <Users className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-[14px] font-semibold text-deep-blue">{conversation.name}</span>
        <span className="shrink-0 text-[11px] text-[#98A2B3]">
          {formatMessageTime(conversation.time)}
        </span>
      </span>
      <span className="block truncate text-[12px] text-[#64748B]">
        {conversation.preview || "No messages"}
      </span>
      <span className="mt-0.5 block text-[11px] text-[#98A2B3]">
        {countLabel(conversation.participants.length, "member")} ·{" "}
        {countLabel(conversation.messageCount, "message")}
      </span>
    </span>
  </button>
);

export default ConversationItem;
