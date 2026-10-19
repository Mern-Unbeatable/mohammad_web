import ChatRedirect from "@/shared/layout/ChatLayout/ChatRedirect";
import LegacyChatRedirect from "@/shared/layout/ChatLayout/LegacyChatRedirect";
import { CHAT_SECTIONS, toRoleChatPath } from "@/shared/constants/chat";

const { DIRECT, GROUP } = CHAT_SECTIONS;

/**
 * Section routes rendered by a persistent `ChatLayout`; they only carry params.
 * `element: null` marks them as intentionally empty (an omitted element makes
 * React Router warn about an "empty" leaf route).
 */
export const chatSectionRoutes = [
  { path: DIRECT, element: null, handle: { chatSection: DIRECT } },
  { path: `${DIRECT}/:userId`, element: null, handle: { chatSection: DIRECT } },
  { path: GROUP, element: null, handle: { chatSection: GROUP } },
  { path: `${GROUP}/:groupId`, element: null, handle: { chatSection: GROUP } },
];

export function buildChatRoute({
  path,
  basePath,
  shell,
  inbox,
  extraRoutes = [],
}) {
  return {
    path,
    ...(shell ? { element: shell } : {}),
    handle: { title: "Chat", chatBase: basePath, roleRedirect: toRoleChatPath },
    children: [
      { index: true, element: <ChatRedirect /> },
      { element: inbox, children: chatSectionRoutes },
      ...extraRoutes,
      { path: "*", element: <ChatRedirect /> },
    ],
  };
}

export const legacyChatRoute = (path, to) => ({
  path,
  element: <LegacyChatRedirect to={to} />,
});
