import Container from "@/components/ui/Container";
import { useFloatingChat } from "./floatingChatContext";
import FloatingChatWindow from "./components/FloatingChatWindow";

/**
 * Bottom-right anchor for the floating chat popup. A fixed, full-width overlay
 * holds a centered `Container` (matching the app's content width) and right-
 * aligns the popup to the content edge, so it never floats out in the viewport
 * margins on wide screens. Rendered once by the provider.
 */
const FloatingChatDock = () => {
  const { recipient, minimized, closeChat, toggleMinimized } = useFloatingChat();
  if (!recipient) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.75rem] z-[90] xl:bottom-0">
      <Container className="flex justify-end">
        <FloatingChatWindow
          key={recipient.id}
          recipient={recipient}
          minimized={minimized}
          onToggleMinimize={toggleMinimized}
          onClose={closeChat}
        />
      </Container>
    </div>
  );
};

export default FloatingChatDock;
