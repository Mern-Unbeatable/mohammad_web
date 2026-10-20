import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  conversationReadByOther,
  conversationRemoved,
  fetchConversation,
  fetchConversations,
  fetchThread,
  markConversationRead,
  messageReceived,
  messageRemoved,
  messageUpdated,
  presenceChanged,
  presenceSet,
  queryPresence,
  useMessagesSocket,
  useTypingEmitter,
} from '@/features/messages';
import { POLL_INTERVAL_MS } from '../constant/constants';
import { presenceIdsKey } from '../utils/chatModels';

/**
 * Socket events, typing emitter, polling while disconnected and presence
 * queries for the inbox. `onActiveRemoved` runs when the open conversation
 * is removed (before the slice drops it).
 */
export function useChatRealtime({
  type,
  search,
  conversations,
  activeConversationId,
  activeRaw,
  currentUserId,
  typingByConversation,
  setTyping,
  onActiveRemoved,
}) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const hasConnectedRef = useRef(false);

  const refreshVisible = useCallback(() => {
    dispatch(fetchConversations({ type, search, page: 1, silent: true }));
    if (activeConversationId) {
      dispatch(fetchThread({ conversationId: activeConversationId, silent: true }));
    }
  }, [dispatch, type, search, activeConversationId]);

  const { connected } = useMessagesSocket({
    connect: (instance) => {
      socketRef.current = instance;
      // Catch up on anything missed while disconnected.
      if (hasConnectedRef.current) refreshVisible();
      hasConnectedRef.current = true;
    },
    'message:new': ({ conversationId, message }) => {
      if (message?.senderId) setTyping(conversationId, message.senderId, false);
      const known = conversations.some((c) => c.id === conversationId);
      dispatch(messageReceived({ conversationId, message, currentUserId }));
      if (!known) dispatch(fetchConversation(conversationId));
      if (
        conversationId === activeConversationId &&
        message?.senderId !== currentUserId &&
        document.visibilityState === 'visible'
      ) {
        dispatch(markConversationRead(conversationId));
      }
    },
    'message:updated': (payload) => {
      dispatch(messageUpdated(payload));
      dispatch(fetchConversation(payload.conversationId));
    },
    'message:deleted': (payload) => {
      dispatch(messageRemoved(payload));
      dispatch(fetchConversation(payload.conversationId));
    },
    'conversation:new': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:updated': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:removed': ({ conversationId }) => {
      if (conversationId === activeConversationId) {
        toast('This conversation is no longer available');
        onActiveRemoved();
      }
      dispatch(conversationRemoved(conversationId));
    },
    'conversation:read': (payload) => dispatch(conversationReadByOther(payload)),
    'presence:update': (payload) => {
      dispatch(presenceChanged(payload));
      if (payload?.online === false) {
        Object.keys(typingByConversation).forEach((conversationId) =>
          setTyping(conversationId, payload.userId, false),
        );
      }
    },
    typing: ({ conversationId, userId, typing } = {}) => {
      if (!conversationId || !userId || userId === currentUserId) return;
      setTyping(conversationId, userId, Boolean(typing));
    },
  });

  const typingEmitter = useTypingEmitter(socketRef, activeConversationId);

  useEffect(() => {
    if (connected) return undefined;
    const timer = setInterval(refreshVisible, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [connected, refreshVisible]);

  const presenceKey = useMemo(
    () => presenceIdsKey(conversations, activeRaw, currentUserId),
    [conversations, activeRaw, currentUserId],
  );

  useEffect(() => {
    if (!connected || !presenceKey) return undefined;
    let cancelled = false;
    queryPresence(socketRef.current, presenceKey.split(',')).then((ids) => {
      if (!cancelled) dispatch(presenceSet(ids));
    });
    return () => {
      cancelled = true;
    };
  }, [connected, presenceKey, dispatch]);

  return typingEmitter;
}
