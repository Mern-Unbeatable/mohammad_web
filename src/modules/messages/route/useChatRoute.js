import { useMatches, useParams } from 'react-router';
import { CHAT_BASE_PATHS, CHAT_SECTIONS } from '@/shared/constants/chat';

const lastHandle = (matches, key) => {
  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const value = matches[i].handle?.[key];
    if (value) return value;
  }
  return null;
};

/**
 * Chat location from the matched routes (see `buildChatRoute`):
 * `basePath` from `handle.chatBase`, `section` from `handle.chatSection`,
 * `targetId` from `:userId` / `:groupId`.
 */
export function useChatRoute() {
  const matches = useMatches();
  const params = useParams();
  const basePath = lastHandle(matches, 'chatBase') || CHAT_BASE_PATHS.USER;
  const section = lastHandle(matches, 'chatSection');
  const targetId =
    section === CHAT_SECTIONS.GROUP
      ? params.groupId
      : section === CHAT_SECTIONS.DIRECT
        ? params.userId
        : null;
  return { basePath, section, targetId: targetId || null };
}
