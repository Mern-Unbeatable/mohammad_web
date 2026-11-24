import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  clearAdminMessagesError,
  fetchModerationConversation,
  fetchModerationConversations,
  fetchModerationThread,
  moderateDeleteConversation,
  moderateDeleteMessage,
  selectModerationConversation,
} from "@/features/messages/moderation";
import { nextConversationsParams, olderMessagesParams } from "@/features/messages";
import { hasMorePages } from "../utils/moderation";
import { SEARCH_DEBOUNCE_MS } from "../constant/constants";

/**
 * Platform-wide conversation list (debounced search, type filter, load more),
 * the selected thread (load older) and message / conversation removal.
 */
export const useChatModeration = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    meta,
    listLoading,
    loadingMore,
    listError,
    selectedId,
    selected,
    messages,
    hasMore,
    threadLoading,
    olderLoading,
    deleting,
    error,
  } = useSelector((state) => state.adminMessages);

  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [pendingMessageId, setPendingMessageId] = useState(null);
  const [confirmDeleteConversation, setConfirmDeleteConversation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(fetchModerationConversations({ page: 1, search, type }));
  }, [dispatch, search, type]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearAdminMessagesError());
  }, [error, dispatch]);

  const openConversation = (id) => {
    dispatch(selectModerationConversation(id));
    dispatch(fetchModerationConversation(id));
    dispatch(fetchModerationThread({ conversationId: id }));
  };

  const closeConversation = () => dispatch(selectModerationConversation(null));

  const loadMoreConversations = () =>
    dispatch(fetchModerationConversations({ ...nextConversationsParams(meta), search, type }));

  const loadOlderMessages = () =>
    dispatch(
      fetchModerationThread({ conversationId: selectedId, ...olderMessagesParams(messages) }),
    );

  const deleteMessage = async () => {
    const messageId = pendingMessageId;
    setPendingMessageId(null);
    const result = await dispatch(moderateDeleteMessage({ conversationId: selectedId, messageId }));
    if (moderateDeleteMessage.fulfilled.match(result)) toast.success("Message removed");
  };

  const deleteConversation = async () => {
    const result = await dispatch(moderateDeleteConversation(selectedId));
    setConfirmDeleteConversation(false);
    if (moderateDeleteConversation.fulfilled.match(result)) {
      toast.success("Conversation deleted");
    }
  };

  return {
    list: {
      query,
      setQuery,
      type,
      setType,
      total: meta?.total ?? 0,
      conversations,
      loading: listLoading && conversations.length === 0,
      error: listError,
      retry: () => dispatch(fetchModerationConversations({ page: 1, search, type })),
      selectedId,
      hasMore: hasMorePages(meta),
      loadingMore,
      loadMore: loadMoreConversations,
      open: openConversation,
    },
    thread: {
      selected,
      messages,
      loading: threadLoading && messages.length === 0,
      hasOlder: hasMore,
      olderLoading,
      loadOlder: loadOlderMessages,
      close: closeConversation,
      requestDeleteMessage: setPendingMessageId,
      requestDeleteConversation: () => setConfirmDeleteConversation(true),
    },
    removal: {
      deleting,
      messageOpen: Boolean(pendingMessageId),
      closeMessage: () => setPendingMessageId(null),
      confirmMessage: deleteMessage,
      conversationOpen: confirmDeleteConversation,
      closeConversation: () => setConfirmDeleteConversation(false),
      confirmConversation: deleteConversation,
    },
  };
};
