import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  messagesApi,
  toMessageModel,
  useMessagesSocket,
  useTypingEmitter,
  useUserPresence,
} from "@/features/messages";

const TYPING_EXPIRY_MS = 6000;
const PAGE_SIZE = 30;

/**
 * Data layer for a single floating direct conversation. Reuses the existing
 * messaging HTTP API, Socket.IO realtime events and presence — it keeps its
 * own local thread so it never interferes with the main /messages page state.
 */
export function useFloatingThread(recipient, { minimized }) {
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const recipientId = recipient?.id || null;

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [olderLoading, setOlderLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [unseen, setUnseen] = useState(0);

  const socketRef = useRef(null);
  const conversationIdRef = useRef(null);
  const recipientIdRef = useRef(null);
  const minimizedRef = useRef(minimized);
  const typingTimerRef = useRef(null);

  conversationIdRef.current = conversationId;
  recipientIdRef.current = recipientId;
  minimizedRef.current = minimized;

  const { getStatus } = useUserPresence(recipientId ? [recipientId] : []);
  const online = getStatus(recipientId) === "online";

  const markReadNow = useCallback((id) => {
    const cid = id || conversationIdRef.current;
    if (!cid) return;
    messagesApi.markRead(cid).catch(() => undefined);
    setUnseen(0);
  }, []);

  const upsertMessage = useCallback((raw) => {
    if (!raw?.id) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === raw.id)) {
        return prev.map((m) => (m.id === raw.id ? raw : m));
      }
      return [...prev, raw];
    });
  }, []);

  const loadThread = useCallback(async (cid) => {
    const { data, hasMore: more } = await messagesApi.getThread(cid, {
      pageSize: PAGE_SIZE,
    });
    setMessages(data);
    setHasMore(more);
  }, []);

  // Resolve (or reset) the conversation whenever the recipient changes.
  useEffect(() => {
    if (!recipientId) return undefined;
    let cancelled = false;
    setConversationId(null);
    setMessages([]);
    setHasMore(false);
    setOtherTyping(false);
    setUnseen(0);
    setLoading(true);

    (async () => {
      try {
        const convo = await messagesApi.getDirectConversation(recipientId);
        if (cancelled) return;
        if (convo?.id) {
          setConversationId(convo.id);
          conversationIdRef.current = convo.id;
          await loadThread(convo.id);
          if (!cancelled && !minimizedRef.current) markReadNow(convo.id);
        }
      } catch {
        if (!cancelled) toast.error("Could not open this conversation");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [recipientId, loadThread, markReadNow]);

  // Mark read when the popup is expanded with the conversation open.
  useEffect(() => {
    if (!minimized && conversationId) markReadNow(conversationId);
  }, [minimized, conversationId, markReadNow]);

  const noteTyping = useCallback((typing) => {
    clearTimeout(typingTimerRef.current);
    setOtherTyping(typing);
    if (typing) {
      typingTimerRef.current = setTimeout(() => setOtherTyping(false), TYPING_EXPIRY_MS);
    }
  }, []);

  useEffect(() => () => clearTimeout(typingTimerRef.current), []);

  useMessagesSocket({
    connect: (instance) => {
      socketRef.current = instance;
    },
    "message:new": ({ conversationId: cid, message } = {}) => {
      if (!message) return;
      if (cid && cid === conversationIdRef.current) {
        upsertMessage(message);
        if (message.senderId === recipientIdRef.current) {
          noteTyping(false);
          if (minimizedRef.current) setUnseen((n) => n + 1);
          else markReadNow(cid);
        }
        return;
      }
      // A brand-new conversation with this recipient we had not resolved yet.
      if (
        !conversationIdRef.current &&
        message.senderId === recipientIdRef.current &&
        recipientIdRef.current
      ) {
        setConversationId(cid);
        conversationIdRef.current = cid;
        loadThread(cid).then(() => {
          if (minimizedRef.current) setUnseen((n) => n + 1);
          else markReadNow(cid);
        });
      }
    },
    "message:updated": ({ message } = {}) => {
      if (message?.id && message.conversationId === conversationIdRef.current) {
        upsertMessage(message);
      }
    },
    "message:deleted": ({ conversationId: cid, messageId } = {}) => {
      if (cid === conversationIdRef.current) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    },
    typing: ({ conversationId: cid, userId, typing } = {}) => {
      if (cid === conversationIdRef.current && userId === recipientIdRef.current) {
        noteTyping(Boolean(typing));
      }
    },
  });

  const typingEmitter = useTypingEmitter(socketRef, conversationId);

  const loadOlder = useCallback(async () => {
    const cid = conversationIdRef.current;
    const oldest = messages[0];
    if (!cid || !oldest || olderLoading) return;
    setOlderLoading(true);
    try {
      const { data, hasMore: more } = await messagesApi.getThread(cid, {
        pageSize: PAGE_SIZE,
        before: oldest.time,
        beforeId: oldest.id,
      });
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...data.filter((m) => !seen.has(m.id)), ...prev];
      });
      setHasMore(more);
    } catch {
      toast.error("Could not load older messages");
    } finally {
      setOlderLoading(false);
    }
  }, [messages, olderLoading]);

  const send = useCallback(
    async ({ body, attachments }) => {
      if (!recipientIdRef.current || sending) return false;
      setSending(true);
      try {
        typingEmitter.stop();
        let cid = conversationIdRef.current;
        if (!cid) {
          // The thread needs a first text message to exist (mirrors the
          // existing "new message" flow); attachments follow once it does.
          const convo = await messagesApi.startDirect({
            participantId: recipientIdRef.current,
            message: body,
          });
          cid = convo?.id;
          if (!cid) throw new Error("Could not start the conversation");
          setConversationId(cid);
          conversationIdRef.current = cid;
          await loadThread(cid);
          if (attachments.length) {
            upsertMessage(await messagesApi.sendMessage(cid, { attachments }));
          }
        } else {
          upsertMessage(await messagesApi.sendMessage(cid, { body, attachments }));
        }
        return true;
      } catch (err) {
        toast.error(messagesApi.getApiErrorMessage(err, "Failed to send message"));
        return false;
      } finally {
        setSending(false);
      }
    },
    [sending, typingEmitter, loadThread, upsertMessage],
  );

  const uploadFile = useCallback(async (file) => {
    try {
      return await messagesApi.uploadAttachment(file);
    } catch (err) {
      toast.error(messagesApi.getApiErrorMessage(err, `Could not upload ${file.name}`));
      return null;
    }
  }, []);

  const messageModels = useMemo(
    () => messages.map((m) => toMessageModel(m, currentUserId)).filter(Boolean),
    [messages, currentUserId],
  );

  return {
    conversationId,
    messages: messageModels,
    loading,
    olderLoading,
    hasMore,
    sending,
    online,
    otherTyping,
    unseen,
    requireText: !conversationId,
    loadOlder,
    send,
    uploadFile,
    notifyTyping: typingEmitter.notify,
    stopTyping: typingEmitter.stop,
    markReadNow,
  };
}
