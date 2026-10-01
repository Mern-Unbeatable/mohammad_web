import {
  CHAT_BASE_PATHS,
  CHAT_SECTIONS,
  chatPath,
  chatTargetFor,
} from "@/shared/constants/chat";
import { getConversation } from "./messagesApi";

/** Inbox paths that used `?conversation=` / `?user=` before the chat route refactor. */
const LEGACY_CHAT_PATHS = new Set([
  "/messages",
  "/supplier/messages",
  ...Object.values(CHAT_BASE_PATHS),
]);

/**
 * `{ conversationId }` / `{ userId }` from a legacy chat link such as
 * `/messages?conversation=<id>`; null for any other link.
 */
export function parseLegacyChatLink(link) {
  if (typeof link !== "string" || !link.includes("?")) return null;
  let url;
  try {
    url = new URL(link, "http://app.local");
  } catch {
    return null;
  }
  if (!LEGACY_CHAT_PATHS.has(url.pathname.replace(/\/+$/, ""))) return null;
  const userId = url.searchParams.get("user");
  if (userId) return { userId };
  const conversationId = url.searchParams.get("conversation");
  return conversationId ? { conversationId } : null;
}

/**
 * Chat route for a legacy link under `basePath`, looked up from the
 * conversation itself (direct → other member, group → conversation id).
 * Resolves `null` when the link is not a legacy chat link; rejects when the
 * conversation cannot be loaded.
 */
export async function resolveLegacyChatLink(link, basePath) {
  const legacy = parseLegacyChatLink(link);
  if (!legacy) return null;
  if (legacy.userId) {
    return chatPath(basePath, { section: CHAT_SECTIONS.DIRECT, id: legacy.userId });
  }
  const target = chatTargetFor(await getConversation(legacy.conversationId));
  return chatPath(basePath, target ?? undefined);
}

/**
 * Where a notification click should go: legacy chat links become the chat
 * route under `basePath`; other links are returned unchanged. When the
 * conversation can't be loaded, falls back to the inbox with `failed: true`.
 */
export async function resolveNotificationLink(link, basePath) {
  try {
    return { to: (await resolveLegacyChatLink(link, basePath)) ?? link, failed: false };
  } catch {
    return { to: chatPath(basePath), failed: true };
  }
}
