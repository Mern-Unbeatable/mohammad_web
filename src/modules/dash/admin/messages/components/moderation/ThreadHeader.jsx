import { ArrowLeft, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

/** Back (small screens), conversation name, participant chips and Delete conversation. */
const ThreadHeader = ({ conversation, onBack, onDelete }) => (
  <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-3 sm:px-5">
    <div className="flex min-w-0 items-start gap-2">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB] xl:hidden"
        aria-label="Back to conversations"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-deep-blue">{conversation.name}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {conversation.participants.map((participant) => (
            <span
              key={participant.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] py-0.5 pl-0.5 pr-2 text-[11px] text-[#475467]"
            >
              <Avatar
                src={participant.avatar}
                alt={participant.name}
                initials={participant.initials}
                size="sm"
                className="!h-5 !w-5 !text-[9px]"
              />
              {participant.name}
            </span>
          ))}
        </div>
      </div>
    </div>
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#FDA29B] px-3 py-2 text-[12px] font-semibold text-[#CC1016] hover:bg-[#FEF3F2]"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete conversation
    </button>
  </div>
);

export default ThreadHeader;
