import { useMemo } from 'react';
import { isSeenByOther, toConversationModel, toMessageModel } from '@/features/messages';
import { typingNamesFor, withTypingNames } from '../utils/chatModels';

/** View models for the conversation list and the open thread. */
export function useChatModels({
  conversations,
  messages,
  onlineUserIds,
  typingByConversation,
  activeRaw,
  activeConversationId,
  currentUserId,
}) {
  const onlineSet = useMemo(() => new Set(onlineUserIds), [onlineUserIds]);

  const chats = useMemo(
    () =>
      conversations
        .map((c) => toConversationModel(c, { onlineUserIds: onlineSet, currentUserId }))
        .filter(Boolean)
        .map((chat) => withTypingNames(chat, typingByConversation[chat.id])),
    [conversations, onlineSet, currentUserId, typingByConversation],
  );

  const messageModels = useMemo(
    () => messages.map((m) => toMessageModel(m, currentUserId)).filter(Boolean),
    [messages, currentUserId],
  );

  const activeModel = activeRaw
    ? toConversationModel(activeRaw, { onlineUserIds: onlineSet, currentUserId })
    : null;
  const typingNames = typingNamesFor(
    activeModel?.participants,
    typingByConversation[activeConversationId],
  );
  const activeChat = activeModel
    ? { ...activeModel, messages: messageModels, typingNames }
    : null;
  const seen = isSeenByOther(activeRaw, messageModels, currentUserId);

  return { onlineSet, chats, activeModel, activeChat, seen };
}
