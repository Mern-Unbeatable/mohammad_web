import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { ConversationItem } from "@/components/data-display/Messenger/Messenger";
import { messagesApi, toConversationModel } from "@/features/messages";
import { useAuth } from "@/shared/auth/useAuth";
import {
  CHAT_BASE_PATHS,
  chatPath,
  chatTargetFor,
} from "@/shared/constants/chat";
import NavHoverMenu from "./NavHoverMenu";

/** Server maximum per page; the preview walks every page. */
const PAGE_SIZE = 100;

const fetchAllConversations = async () => {
  const rows = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data, meta } = await messagesApi.getConversations({
      page,
      pageSize: PAGE_SIZE,
    });
    rows.push(...(data || []));
    totalPages = Number(meta?.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};

const ConversationSkeleton = () => (
  <div className="space-y-1 p-3" aria-hidden="true">
    {[0, 1, 2].map((row) => (
      <div key={row} className="flex items-center gap-3 px-1 py-2.5">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#EEF2F6]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-[#EEF2F6]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#EEF2F6]" />
        </div>
      </div>
    ))}
  </div>
);

/** Latest conversations on hover; the wrapped link still opens the inbox. */
const MessagesHoverMenu = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  const loadPreview = async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const data = await fetchAllConversations();
      if (requestId !== requestRef.current) return;
      setChats(
        data
          .map((conversation) =>
            toConversationModel(conversation, { currentUserId: user?.id }),
          )
          .filter(Boolean),
      );
    } catch (err) {
      if (requestId === requestRef.current) {
        toast.error(
          messagesApi.getApiErrorMessage(err, "Failed to load conversations"),
        );
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  const openChat = (chat) => {
    const target = chatTargetFor(chat);
    navigate(chatPath(CHAT_BASE_PATHS.USER, target ?? undefined));
  };

  return (
    <NavHoverMenu
      title="Messages"
      footerLabel="See all messages"
      footerTo={CHAT_BASE_PATHS.USER}
      onOpen={loadPreview}
      body={
        loading && chats.length === 0 ? (
          <ConversationSkeleton />
        ) : chats.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-[#64748B]">
            No conversations yet.
          </p>
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
