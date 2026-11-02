import { useCallback, useEffect, useRef, useState } from 'react';
import { TYPING_EXPIRY_MS } from '../constant/constants';

/**
 * `{ [conversationId]: userId[] }` of other members currently typing. Each
 * entry expires after `TYPING_EXPIRY_MS` in case the "stopped" event is lost.
 */
export function useTypingIndicators() {
  const [typingByConversation, setTypingByConversation] = useState({});
  const typingTimersRef = useRef(new Map());

  const updateTypingList = useCallback((conversationId, userId, typing) => {
    setTypingByConversation((prev) => {
      const current = prev[conversationId] || [];
      const has = current.includes(userId);
      if (typing === has) return prev;
      const next = typing ? [...current, userId] : current.filter((id) => id !== userId);
      return { ...prev, [conversationId]: next };
    });
  }, []);

  const setTyping = useCallback(
    (conversationId, userId, typing) => {
      const key = `${conversationId}:${userId}`;
      clearTimeout(typingTimersRef.current.get(key));
      typingTimersRef.current.delete(key);
      if (typing) {
        typingTimersRef.current.set(
          key,
          setTimeout(() => {
            typingTimersRef.current.delete(key);
            updateTypingList(conversationId, userId, false);
          }, TYPING_EXPIRY_MS),
        );
      }
      updateTypingList(conversationId, userId, typing);
    },
    [updateTypingList],
  );

  useEffect(() => {
    const timers = typingTimersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  return { typingByConversation, setTyping };
}
