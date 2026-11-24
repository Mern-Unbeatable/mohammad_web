import { MessageSquare } from "lucide-react";
import { ConversationItem } from "@/components/data-display/Messenger/Messenger";
import { CHAT_BASE_PATHS } from "@/features/messages/chatPaths";
import { useMessagesPreview } from "../../hooks/useMessagesPreview";
import NavHoverMenu from "./NavHoverMenu";
import ConversationSkeleton from "@/components/loader/skeletons/rows/ConversationSkeleton";
import PreviewEmpty from "./PreviewEmpty";

/** Latest conversations on hover; the wrapped link still opens the inbox. */
const MessagesHoverMenu = ({ children }) => {
  const { chats, loading, loadPreview, openChat } = useMessagesPreview();

  return (
    <NavHoverMenu
      title="Messages"
      icon={MessageSquare}
      footerLabel="See all messages"
      footerTo={CHAT_BASE_PATHS.USER}
      onOpen={loadPreview}
      body={
        loading && chats.length === 0 ? (
          <ConversationSkeleton />
        ) : chats.length === 0 ? (
          <PreviewEmpty>No conversations yet.</PreviewEmpty>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li key={chat.id}>
                <ConversationItem
                  chat={chat}
                  onClick={() => openChat(chat)}
                />
              </li>
            ))}
          </ul>
        )
      }
    >
      {children}
    </NavHoverMenu>
  );
};

export default MessagesHoverMenu;
