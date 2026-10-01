import ChatRedirect from '@/shared/layout/ChatLayout/ChatRedirect';
import LegacyChatRedirect from '@/shared/layout/ChatLayout/LegacyChatRedirect';
import { CHAT_SECTIONS, toRoleChatPath } from '@/shared/constants/chat';

const { DIRECT, GROUP } = CHAT_SECTIONS;

/** Section routes rendered by a persistent `ChatLayout`; they only carry params. */
export const chatSectionRoutes = [
  { path: DIRECT, handle: { chatSection: DIRECT } },
  { path: `${DIRECT}/:userId`, handle: { chatSection: DIRECT } },
  { path: GROUP, handle: { chatSection: GROUP } },
  { path: `${GROUP}/:groupId`, handle: { chatSection: GROUP } },
];

/**
 * Chat subtree for a role:
 *   <base>                     → redirect (also upgrades legacy `?conversation=` links)
 *   <base>/messages[/:userId]  → inbox layout, direct chats
 *   <base>/group[/:groupId]    → inbox layout, group chats
 *   <base>/<extraRoutes>       → e.g. admin moderation
 *   <base>/*                   → redirect
 * `shell` wraps every chat page (defaults to a bare outlet); `inbox` is the
 * persistent layout for the section routes. Access is guarded by the
 * enclosing role subtree; `roleRedirect` sends other roles to their own chat.
 */
export function buildChatRoute({ path, basePath, shell, inbox, extraRoutes = [] }) {
  return {
    path,
    ...(shell ? { element: shell } : {}),
    handle: { title: 'Chat', chatBase: basePath, roleRedirect: toRoleChatPath },
    children: [
      { index: true, element: <ChatRedirect /> },
      { element: inbox, children: chatSectionRoutes },
      ...extraRoutes,
      { path: '*', element: <ChatRedirect /> },
    ],
  };
}

export const legacyChatRoute = (path, to) => ({
  path,
  element: <LegacyChatRedirect to={to} />,
});
