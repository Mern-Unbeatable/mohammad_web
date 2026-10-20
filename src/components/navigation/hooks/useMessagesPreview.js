import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { messagesApi, toConversationModel } from '@/features/messages';
import { useAuth } from '@/modules/auth';
import { CHAT_BASE_PATHS, chatPath, chatTargetFor } from '@/features/messages/chatPaths';
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

  const openChat = (chat) => {
    const target = chatTargetFor(chat);
    navigate(chatPath(CHAT_BASE_PATHS.USER, target ?? undefined));
  };

  return { chats, loading, loadPreview, openChat };
}
