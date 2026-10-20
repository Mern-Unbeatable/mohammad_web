import { CHAT_BASE_PATHS } from "@/features/messages/chatPaths";

export const ADMIN_CHAT_PATH = CHAT_BASE_PATHS.ADMIN;
export const ADMIN_CHAT_MODERATION_PATH = `${ADMIN_CHAT_PATH}/moderation`;

export const CHAT_TAB = { INBOX: "inbox", MODERATION: "moderation" };

export const CHAT_TABS = [
  { id: CHAT_TAB.INBOX, label: "My conversations" },
  { id: CHAT_TAB.MODERATION, label: "Moderation" },
];

export const SEARCH_DEBOUNCE_MS = 300;

export const TYPE_OPTIONS = [
  { id: "", label: "All" },
  { id: "direct", label: "Direct" },
  { id: "group", label: "Groups" },
];

export const SYSTEM_MESSAGE_TYPE = "SYSTEM";
