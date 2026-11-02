import { createContext, useContext } from "react";

/**
 * LinkedIn-style floating chat state. A single direct-message popup is shown at
 * the bottom-right; opening a different recipient switches the popup to them
 * (never duplicates). Only wired into the regular-user dashboard.
 */
export const FloatingChatContext = createContext(null);

const NOOP = {
  recipient: null,
  minimized: false,
  isOpen: false,
  openChat: () => {},
  closeChat: () => {},
  setMinimized: () => {},
  toggleMinimized: () => {},
};

export function useFloatingChat() {
  return useContext(FloatingChatContext) || NOOP;
}
