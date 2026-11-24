import { Loader2, MessageSquare } from "lucide-react";
import Spinner from "../common/Spinner";
import ThreadHeader from "./ThreadHeader";
import MessageItem from "./MessageItem";

const NoSelection = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
    <MessageSquare className="h-6 w-6 text-[#98A2B3]" />
    <p className="text-[14px] font-semibold text-deep-blue">Select a conversation</p>
    <p className="max-w-xs text-[13px] text-[#64748B]">
      Review messages and remove content that breaks the platform rules.
    </p>
  </div>
);

/** Right column: the selected conversation's header and messages, or a placeholder. */
const ThreadPanel = ({ open, thread }) => (
  <section className={`min-h-0 flex-col ${open ? "flex flex-1" : "hidden xl:flex"}`}>
    {thread.selected ? (
      <>
        <ThreadHeader
          conversation={thread.selected}
          onBack={thread.close}
          onDelete={thread.requestDeleteConversation}
        />

        <div
          role="log"
          aria-label={`Messages in ${thread.selected.name}`}
          aria-live="off"
          tabIndex={0}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 sm:px-5"
        >
          {thread.hasOlder ? (
            <div className="flex justify-center">
              <button
                type="button"
                disabled={thread.olderLoading}
                onClick={thread.loadOlder}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-medium text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
              >
                {thread.olderLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Load older messages
              </button>
            </div>
          ) : null}

          {thread.loading ? (
            <Spinner />
          ) : thread.messages.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[#98A2B3]">No messages.</p>
          ) : (
            thread.messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onRemove={thread.requestDeleteMessage}
              />
            ))
          )}
        </div>
      </>
    ) : (
      <NoSelection />
    )}
  </section>
);

export default ThreadPanel;
