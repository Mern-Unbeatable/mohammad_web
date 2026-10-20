import { chatPath } from "@/features/messages/chatPaths";
import {
  ADMIN_CHAT_MODERATION_PATH,
  ADMIN_CHAT_PATH,
  CHAT_TAB,
  SYSTEM_MESSAGE_TYPE,
} from "../constant/constants";

/** The chat tab is the route: `/moderation` vs. any inbox section. */
export const activeChatTab = (pathname) =>
  pathname.startsWith(ADMIN_CHAT_MODERATION_PATH) ? CHAT_TAB.MODERATION : CHAT_TAB.INBOX;

export const chatTabPath = (tab) =>
  tab === CHAT_TAB.MODERATION ? ADMIN_CHAT_MODERATION_PATH : chatPath(ADMIN_CHAT_PATH);

/** "1 message", "3 messages". */
export const countLabel = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

export const hasMorePages = (meta) => (meta?.page ?? 1) < (meta?.totalPages ?? 1);
export const nextPage = (meta) => (meta?.page ?? 1) + 1;

export const isSystemMessage = (message) => message.type === SYSTEM_MESSAGE_TYPE;
