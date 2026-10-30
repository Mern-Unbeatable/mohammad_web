import { useFloatingChat } from "./floatingChatContext";
import FloatingChatWindow from "./components/FloatingChatWindow";

/**
 * Fixed bottom-right anchor for the floating chat popup. Rendered once by the
 * provider; shows the single active conversation (if any).
 */
const FloatingChatDock = () => {
  const { recipient, minimized, closeChat, toggleMinimized } = useFloatingChat();
  if (!recipient) return null;

  return (
    <div className="pointer-events-none fixed bottom-[4.75rem] right-3 z-[90] flex items-end gap-3 sm:right-5 xl:bottom-0">
      <FloatingChatWindow
        key={recipient.id}
        recipient={recipient}
        minimized={minimized}
        onToggleMinimize={toggleMinimized}
        onClose={closeChat}
      />
    </div>
  );
};

export default FloatingChatDock;
