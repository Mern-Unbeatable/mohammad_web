/**
 * Remembers conversations that received messages while the tab was hidden,
 * so the open one can be marked read once the user actually sees it.
 */
export function createHiddenReadTracker() {
  const pending = new Set();

  return {
    /** Records an incoming message; returns true when it can be marked read right away. */
    noteIncoming({ conversationId, activeConversationId, fromSelf, visible }) {
      if (fromSelf || !conversationId || conversationId !== activeConversationId) return false;
      if (visible) return true;
      pending.add(conversationId);
      return false;
    },
    /** On becoming visible: true when the open conversation has unseen messages. */
    takeOnVisible(activeConversationId) {
      const hadUnseen = Boolean(activeConversationId) && pending.has(activeConversationId);
      pending.clear();
      return hadUnseen;
    },
  };
}
