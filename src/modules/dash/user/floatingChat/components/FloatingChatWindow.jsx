import { Link } from "react-router";
import { ChevronDown, ChevronUp, Maximize2, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import PresenceDot from "@/components/ui/PresenceDot";
import { CHAT_BASE_PATHS, chatPath } from "@/features/messages/chatPaths";
import { useFloatingThread } from "../useFloatingThread";
import FloatingChatThread from "./FloatingChatThread";
import FloatingChatComposer from "./FloatingChatComposer";

const HeaderButton = ({ onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15"
  >
    {children}
  </button>
);

/**
 * A single LinkedIn-style floating direct-message popup. Fixed to the
 * bottom-right; minimises to its header bar, expands to the full messages page
 * and closes entirely.
 */
const FloatingChatWindow = ({ recipient, minimized, onToggleMinimize, onClose }) => {
  const thread = useFloatingThread(recipient, { minimized });
  const expandHref = chatPath(CHAT_BASE_PATHS.USER, { id: recipient.id });

  const statusLabel = thread.otherTyping
    ? "typing…"
    : thread.online
      ? "Active now"
      : "Offline";

  return (
    <section
      className="pointer-events-auto flex w-[min(360px,100%)] flex-col overflow-hidden rounded-t-xl border border-[#E4E7EC] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
      style={{ height: minimized ? "auto" : "min(70vh, 520px)" }}
      aria-label={`Chat with ${recipient.name}`}
    >
      <header className="flex shrink-0 items-center gap-2.5 bg-deep-blue px-3 py-2.5">
        <button
          type="button"
          onClick={onToggleMinimize}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          aria-label={minimized ? "Expand chat" : "Minimize chat"}
        >
          <span className="relative shrink-0">
            <Avatar src={recipient.avatar} alt={recipient.name} initials={recipient.initials} size="sm" />
            <PresenceDot online={thread.online} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[13px] font-semibold text-white">
                {recipient.name}
              </span>
              {minimized && thread.unseen > 0 ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#CC1016] px-1 text-[10px] font-semibold text-white">
                  {thread.unseen > 9 ? "9+" : thread.unseen}
                </span>
              ) : null}
            </span>
            <span className="block truncate text-[11px] text-white/70">{statusLabel}</span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <Link
            to={expandHref}
            onClick={onClose}
            aria-label="Open full conversation"
            title="Open in Messages"
            className="rounded-md p-1.5 text-white/90 transition-colors hover:bg-white/15"
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
          <HeaderButton onClick={onToggleMinimize} label={minimized ? "Expand chat" : "Minimize chat"}>
            {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </HeaderButton>
          <HeaderButton onClick={onClose} label="Close chat">
            <X className="h-4 w-4" />
          </HeaderButton>
        </div>
      </header>

      {minimized ? null : (
        <>
          <FloatingChatThread
            messages={thread.messages}
            recipient={recipient}
            loading={thread.loading}
            hasMore={thread.hasMore}
            olderLoading={thread.olderLoading}
            onLoadOlder={thread.loadOlder}
            otherTyping={thread.otherTyping}
          />
          <FloatingChatComposer
            sending={thread.sending}
            requireText={thread.requireText}
            uploadFile={thread.uploadFile}
            onSend={thread.send}
            onTyping={thread.notifyTyping}
            onStopTyping={thread.stopTyping}
          />
        </>
      )}
    </section>
  );
};

export default FloatingChatWindow;
