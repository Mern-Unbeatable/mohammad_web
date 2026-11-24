import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { messagesApi, toConversationModel } from '@/features/messages';
import { useAuth } from '@/modules/auth';
import { CHAT_BASE_PATHS, chatPath, chatTargetFor } from '@/features/messages/chatPaths';
import { useFloatingChat } from '@/modules/dash/user/floatingChat/floatingChatContext';
import { CONVERSATIONS_PAGE_SIZE } from '../constant/constants';

const fetchAllConversations = async () => {
  const rows = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data, meta } = await messagesApi.getConversations({
      page,
      pageSize: CONVERSATIONS_PAGE_SIZE,
    });
    rows.push(...(data || []));
    totalPages = Number(meta?.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
};

/** Conversations for the navbar hover preview; stale responses are ignored. */
export function useMessagesPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openChat: openFloatingChat } = useFloatingChat();
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
          .map((conversation) => toConversationModel(conversation, { currentUserId: user?.id }))
          .filter(Boolean),
      );
    } catch (err) {
      if (requestId === requestRef.current) {
        toast.error(messagesApi.getApiErrorMessage(err, 'Failed to load conversations'));
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  /**
   * Direct (user-to-user) conversations open the LinkedIn-style floating popup
   * at the bottom-right (reusing the shared floating chat state, which focuses
   * an already-open popup instead of duplicating it). Group chats keep opening
   * the full inbox.
   */
  const openChat = (chat) => {
    if (chat && !chat.isGroup && chat.otherUserId) {
      openFloatingChat({
        id: chat.otherUserId,
        name: chat.name,
        avatar: chat.avatar,
        initials: chat.initials,
      });
      return;
    }
    const target = chatTargetFor(chat);
    navigate(chatPath(CHAT_BASE_PATHS.USER, target ?? undefined));
  };

  return { chats, loading, loadPreview, openChat };
}
