import { useCallback, useMemo, useState } from "react";
import { FloatingChatContext } from "./floatingChatContext";
import FloatingChatDock from "./FloatingChatDock";

/** Normalises a recipient from the various shapes callers pass (contact, profile, chat model). */
const toRecipient = (user) => {
  if (!user?.id) return null;
  return {
    id: user.id,
    name: user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Member",
    avatar: user.avatar || user.avatarUrl || null,
    initials: user.initials || null,
  };
};

/**
 * Owns the single floating chat popup for the user dashboard and renders the
 * dock. Opening the same recipient again just restores (un-minimises) the
 * popup instead of creating a duplicate.
 */
export function FloatingChatProvider({ children }) {
  const [recipient, setRecipient] = useState(null);
  const [minimized, setMinimized] = useState(false);

  const openChat = useCallback((user) => {
    const next = toRecipient(user);
    if (!next) return;
    setRecipient(next);
    setMinimized(false);
  }, []);

  const closeChat = useCallback(() => setRecipient(null), []);
  const toggleMinimized = useCallback(() => setMinimized((value) => !value), []);

  const value = useMemo(
    () => ({
      recipient,
      minimized,
      isOpen: Boolean(recipient),
      openChat,
      closeChat,
      setMinimized,
      toggleMinimized,
    }),
    [recipient, minimized, openChat, closeChat, toggleMinimized],
  );

  return (
    <FloatingChatContext.Provider value={value}>
      {children}
      <FloatingChatDock />
    </FloatingChatContext.Provider>
  );
}
