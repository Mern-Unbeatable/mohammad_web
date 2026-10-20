import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/modules/auth';
import {
  addParticipants,
  clearMessagesError,
  createGroup,
  deleteMessage,
  editMessage,
  fetchConversations,
  fetchRecipients,
  fetchThread,
  leaveConversation,
  messagesApi,
  removeParticipant,
  renameGroup,
  resetMessages,
  sendMessage,
  setActiveConversation,
  startDirect,
} from '@/features/messages';
import { CHAT_SECTIONS, chatPath, chatTargetFor } from '@/shared/constants/chat';
import { marketplaceListingPath } from '@/shared/constants/marketplace';
import { memberProfilePath } from '@/shared/constants/profile';
import { CHAT_TAB } from '../constant/constants';
import { sectionForTab, tabForSection, typeForTab } from '../utils/chatTabs';
import { findConversation, hasMorePages, memberNameFor, nextPage } from '../utils/chatModels';
import { useTypingIndicators } from './useTypingIndicators';
import { useConversationSearch } from './useConversationSearch';
import { useListingDraft } from './useListingDraft';
import { useOpenConversationFromUrl } from './useOpenConversationFromUrl';
import { useOpenNewestOnDesktop } from './useOpenNewestOnDesktop';
import { useChatRealtime } from './useChatRealtime';
import { useChatModels } from './useChatModels';

/**
 * Wires the messages slice, URL and realtime hooks into props for
 * `MessagesPageContent` and the inbox modals.
 */
export function useMessagesContainer({ variant, basePath, section, targetId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const currentRole = user?.role;
  const {
    conversations,
    conversationsMeta,
    conversationsLoading,
    conversationsLoadingMore,
    activeConversationId,
    activeDetail,
    messages,
    messagesHasMore,
    messagesLoading,
    olderLoading,
    recipients,
    recipientsLoading,
    onlineUserIds,
    sending,
    actionLoading,
    error,
  } = useSelector((state) => state.messages);

  const tab = tabForSection(section);
  const type = typeForTab(tab);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const { typingByConversation, setTyping } = useTypingIndicators();

  useEffect(() => () => dispatch(resetMessages()), [dispatch]);

  const { query, setQuery, search, clearSearch } = useConversationSearch(type);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearMessagesError());
  }, [error, dispatch]);

  const goTo = useCallback(
    (target, options) => navigate(chatPath(basePath, target), options),
    [navigate, basePath],
  );

  const { pendingListing, dropListingParam } = useListingDraft({
    section,
    targetId,
    currentUserId,
  });

  const getListingHref = useCallback(
    (listingId) => marketplaceListingPath(currentRole, listingId),
    [currentRole],
  );

  const getProfileHref = useCallback(
    (userId) => memberProfilePath(currentRole, userId),
    [currentRole],
  );

  const { missingDirectId, clearMissingDirect } = useOpenConversationFromUrl({
    section,
    targetId,
    basePath,
    conversations,
    activeConversationId,
  });

  useOpenNewestOnDesktop({ targetId, conversationsLoading, conversations, type, goTo });

  const activeRaw = findConversation(conversations, activeDetail, activeConversationId);

  const typingEmitter = useChatRealtime({
    type,
    search,
    conversations,
    activeConversationId,
    activeRaw,
    currentUserId,
    typingByConversation,
    setTyping,
    onActiveRemoved: () => {
      setInfoOpen(false);
      goTo({ section }, { replace: true });
    },
  });

  const { onlineSet, chats, activeModel, activeChat, seen } = useChatModels({
    conversations,
    messages,
    onlineUserIds,
    typingByConversation,
    activeRaw,
    activeConversationId,
    currentUserId,
  });

  const composeUserId =
    section === CHAT_SECTIONS.DIRECT && targetId && missingDirectId === targetId
      ? targetId
      : null;
  const mobilePanel = targetId ? 'chat' : 'list';
  const startedDirectRef = useRef(false);

  const handleSearchRecipients = useCallback(
    (term) => dispatch(fetchRecipients({ search: term, include: composeUserId || undefined })),
    [dispatch, composeUserId],
  );

  const openChat = (id) => {
    const target = chatTargetFor(findConversation(conversations, activeDetail, id));
    if (target) {
      if (target.section !== section || target.id !== targetId) goTo(target);
      return;
    }
    // A direct chat whose other member is gone has no addressable URL.
    if (id !== activeConversationId) {
      dispatch(setActiveConversation(id));
      dispatch(fetchThread({ conversationId: id }));
    }
  };

  const handleTabChange = (nextTab) => {
    if (nextTab === tab) return;
    clearSearch();
    goTo({ section: sectionForTab(nextTab) });
  };

  const handleSend = async ({ body, attachments, listingId }) => {
    if (!activeConversationId) return false;
    typingEmitter.stop();
    const result = await dispatch(
      sendMessage({ conversationId: activeConversationId, body, attachments, listingId }),
    );
    const ok = sendMessage.fulfilled.match(result);
    if (ok && listingId) dropListingParam();
    return ok;
  };

  const handleUploadFile = async (file) => {
    try {
      return await messagesApi.uploadAttachment(file);
    } catch (err) {
      toast.error(messagesApi.getApiErrorMessage(err, `Could not upload ${file.name}`));
      return null;
    }
  };

  /** The created/reused conversation is already active; load it and point the URL at it. */
  const openFreshThread = (conversation, options) => {
    if (conversation?.id) dispatch(fetchThread({ conversationId: conversation.id }));
    const target = chatTargetFor(conversation);
    if (target) goTo(target, options);
  };

  const closeNewMessage = () => {
    setNewMessageOpen(false);
    const started = startedDirectRef.current;
    startedDirectRef.current = false;
    // Dismissing the composer opened by `messages/:userId` leaves that URL.
    if (composeUserId && !started) goTo({ section: CHAT_SECTIONS.DIRECT }, { replace: true });
    clearMissingDirect();
  };

  const handleStartDirect = async ({ recipientId, message, listingId }) => {
    const result = await dispatch(
      startDirect({ participantId: recipientId, message, listingId }),
    );
    if (!startDirect.fulfilled.match(result)) return false;
    startedDirectRef.current = true;
    openFreshThread(result.payload, { replace: Boolean(composeUserId) });
    return true;
  };

  const handleCreateGroup = async ({ name, members }) => {
    const result = await dispatch(createGroup({ name, participantIds: members }));
    if (!createGroup.fulfilled.match(result)) return false;
    toast.success(`Group "${name}" created`);
    openFreshThread(result.payload);
    return true;
  };

  /** Resolves true when saved, so the bubble can leave edit mode. */
  const handleEditMessage = async (messageId, body) => {
    if (!activeConversationId) return false;
    const result = await dispatch(
      editMessage({ conversationId: activeConversationId, messageId, body }),
    );
    const ok = editMessage.fulfilled.match(result);
    if (ok) toast.success('Message updated');
    return ok;
  };

  const handleConfirmDelete = async () => {
    const messageId = pendingDeleteId;
    setPendingDeleteId(null);
    if (!activeConversationId || !messageId) return;
    const result = await dispatch(deleteMessage({ conversationId: activeConversationId, messageId }));
    if (deleteMessage.fulfilled.match(result)) toast.success('Message deleted');
  };

  const handleConfirmLeave = async () => {
    if (!activeConversationId) return;
    const result = await dispatch(leaveConversation(activeConversationId));
    setConfirmLeave(false);
    if (leaveConversation.fulfilled.match(result)) {
      toast.success('You left the group');
      setInfoOpen(false);
      goTo({ section: CHAT_SECTIONS.GROUP }, { replace: true });
    }
  };

  /** Failures are toasted from the slice error; `successMessage` is toasted on success. */
  const runGroupAction = async (thunk, arg, successMessage) => {
    const result = await dispatch(thunk(arg));
    const ok = thunk.fulfilled.match(result);
    if (ok && successMessage) toast.success(successMessage);
    return ok;
  };

  const recipientProps = {
    recipients,
    recipientsLoading,
    onSearchRecipients: handleSearchRecipients,
  };

  return {
    pageProps: {
      variant,
      tab,
      onTabChange: handleTabChange,
      chats,
      activeChat,
      activeChatId: activeConversationId,
      onSelectChat: openChat,
      query,
      onSearchChange: setQuery,
      onSend: handleSend,
      onTyping: typingEmitter.notify,
      onTypingStop: typingEmitter.stop,
      sending,
      onUploadFile: handleUploadFile,
      showNewMessageButton: tab === CHAT_TAB.MESSAGES,
      onNewMessage: () => setNewMessageOpen(true),
      showCreateGroupButton: tab === CHAT_TAB.GROUPS,
      onCreateGroup: () => setGroupModalOpen(true),
      onLeave: () => setConfirmLeave(true),
      onDeleteMessage: setPendingDeleteId,
      onEditMessage: handleEditMessage,
      onOpenInfo: () => setInfoOpen(true),
      loading: conversationsLoading,
      threadLoading: messagesLoading,
      hasMoreMessages: messagesHasMore,
      olderLoading,
      onLoadOlder: () =>
        dispatch(
          fetchThread({
            conversationId: activeConversationId,
            before: messages[0]?.time,
          }),
        ),
      hasMoreChats: hasMorePages(conversationsMeta),
      loadingMoreChats: conversationsLoadingMore,
      onLoadMoreChats: () =>
        dispatch(fetchConversations({ type, search, page: nextPage(conversationsMeta) })),
      seen,
      pendingListing: composeUserId ? null : pendingListing,
      onRemovePendingListing: dropListingParam,
      getListingHref,
      getProfileHref,
      mobilePanel,
      onMobileBack: () => goTo({ section }, { replace: true }),
    },
    newMessageProps: {
      open: newMessageOpen || Boolean(composeUserId),
      onClose: closeNewMessage,
      onSend: handleStartDirect,
      ...recipientProps,
      initialRecipientId: composeUserId,
      listing: composeUserId ? pendingListing : null,
      onRemoveListing: dropListingParam,
      submitting: actionLoading,
    },
    createGroupProps: {
      open: groupModalOpen,
      onClose: () => setGroupModalOpen(false),
      onCreate: handleCreateGroup,
      ...recipientProps,
      submitting: actionLoading,
    },
    infoProps: {
      open: infoOpen,
      conversation: activeModel,
      currentUserId,
      onlineUserIds: onlineSet,
      onClose: () => setInfoOpen(false),
      onRename: (name) =>
        runGroupAction(renameGroup, { conversationId: activeConversationId, name }, 'Group renamed'),
      onAddMembers: (participantIds) =>
        runGroupAction(
          addParticipants,
          { conversationId: activeConversationId, participantIds },
          participantIds.length === 1 ? 'Member added' : `${participantIds.length} members added`,
        ),
      onRemoveMember: (userId) =>
        runGroupAction(
          removeParticipant,
          { conversationId: activeConversationId, userId },
          `${memberNameFor(activeModel?.participants, userId, 'Member')} removed from the group`,
        ),
      onLeave: () => setConfirmLeave(true),
      ...recipientProps,
      getProfileHref,
      busy: actionLoading,
    },
    deleteProps: {
      open: Boolean(pendingDeleteId),
      onClose: () => setPendingDeleteId(null),
      onConfirm: handleConfirmDelete,
    },
    leaveProps: {
      open: confirmLeave,
      confirming: actionLoading,
      onClose: () => setConfirmLeave(false),
      onConfirm: handleConfirmLeave,
    },
  };
}
