import { useEffect } from 'react';
import { chatTargetFor } from '@/features/messages/chatPaths';
import { CONVERSATION_TYPE, DESKTOP_QUERY } from '../constant/constants';

/** Desktop: open the newest conversation of the current section when none is in the URL. */
export function useOpenNewestOnDesktop({ targetId, conversationsLoading, conversations, type, goTo }) {
  useEffect(() => {
    if (targetId || conversationsLoading || conversations.length === 0) return;
    const first = conversations[0];
    if (Boolean(first.isGroup) !== (type === CONVERSATION_TYPE.GROUP)) return;
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const target = chatTargetFor(first);
    if (target) goTo(target, { replace: true });
  }, [targetId, conversationsLoading, conversations, type, goTo]);
}
