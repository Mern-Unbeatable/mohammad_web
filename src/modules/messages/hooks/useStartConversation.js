import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { messagesApi } from '@/features/messages';
import { CHAT_SECTIONS, chatPath, chatTargetFor } from '@/features/messages/chatPaths';

/**
 * Sends the first message to `recipientId` (the API reuses an existing 1:1
 * thread) and only then opens that conversation under `basePath`. Rejects
 * with the API error so `StartConversationModal` can show it and stay open.
 *
 * Calls the API directly instead of the `startDirect` thunk: the thunk marks
 * the conversation active before the chat page mounts, which makes the page
 * skip loading its thread.
 */
export function useStartConversation(basePath) {
  const navigate = useNavigate();
  return useCallback(
    async ({ recipientId, message, listingId }) => {
      const conversation = await messagesApi.startDirect({
        participantId: recipientId,
        message,
        listingId,
      });
      const target = chatTargetFor(conversation) || {
        section: CHAT_SECTIONS.DIRECT,
        id: recipientId,
      };
      navigate(chatPath(basePath, target));
    },
    [navigate, basePath],
  );
}
