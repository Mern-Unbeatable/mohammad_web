import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  fetchConversation,
  fetchDirectConversation,
  fetchThread,
  setActiveConversation,
} from '@/features/messages';
import { CHAT_SECTIONS, chatPath } from '@/shared/constants/chat';
import { CONVERSATION_UNAVAILABLE_MESSAGE } from '../constant/constants';

/**
 * URL → open conversation. Runs on direct navigation, refresh and in-app
 * links. Groups are addressed by conversation id, direct chats by the other
 * user's id; a direct target with no thread yet becomes `missingDirectId`
 * so the composer opens for it.
 */
export function useOpenConversationFromUrl({
  section,
  targetId,
  basePath,
  conversations,
  activeConversationId,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [missingDirectId, setMissingDirectId] = useState(null);

  const conversationsRef = useRef(conversations);
  const activeIdRef = useRef(activeConversationId);
  useEffect(() => {
    conversationsRef.current = conversations;
    activeIdRef.current = activeConversationId;
  });

  useEffect(() => {
    if (!targetId) {
      dispatch(setActiveConversation(null));
      return undefined;
    }
    let cancelled = false;
    const open = (conversationId) => {
      if (activeIdRef.current === conversationId) return;
      dispatch(setActiveConversation(conversationId));
      dispatch(fetchThread({ conversationId }));
    };
    const unavailable = () => {
      if (cancelled) return;
      toast.error(CONVERSATION_UNAVAILABLE_MESSAGE);
      navigate(chatPath(basePath, { section }), { replace: true });
    };

    if (section === CHAT_SECTIONS.GROUP) {
      const known = conversationsRef.current.some((c) => c.isGroup && c.id === targetId);
      open(targetId);
      if (!known) {
        dispatch(fetchConversation(targetId)).then((result) => {
          if (!fetchConversation.fulfilled.match(result) || !result.payload?.isGroup) {
            unavailable();
          }
        });
      }
    } else {
      const known = conversationsRef.current.find(
        (c) => !c.isGroup && c.otherUserId === targetId,
      );
      if (known) {
        open(known.id);
      } else {
        dispatch(fetchDirectConversation(targetId)).then((result) => {
          if (cancelled) return;
          if (!fetchDirectConversation.fulfilled.match(result)) {
            unavailable();
          } else if (result.payload) {
            open(result.payload.id);
          } else {
            dispatch(setActiveConversation(null));
            setMissingDirectId(targetId);
          }
        });
      }
    }
    return () => {
      cancelled = true;
    };
  }, [section, targetId, basePath, dispatch, navigate]);

  return { missingDirectId, clearMissingDirect: () => setMissingDirectId(null) };
}
