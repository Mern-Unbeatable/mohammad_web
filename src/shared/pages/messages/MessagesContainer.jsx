import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import MessagesPageContent from '@/shared/pages/messages/MessagesPageContent';
import NewMessageModal from '@/shared/pages/messages/NewMessageModal';
import CreateGroupModal from '@/shared/pages/messages/CreateGroupModal';
import ConversationInfoModal from '@/shared/pages/messages/ConversationInfoModal';
import { useAuth } from '@/shared/auth/useAuth';
import {
  addParticipants,
  clearMessagesError,
  conversationReadByOther,
  conversationRemoved,
  createGroup,
  deleteMessage,
  fetchConversation,
  fetchConversations,
  fetchDirectConversation,
  fetchRecipients,
  fetchThread,
  isSeenByOther,
  leaveConversation,
  markConversationRead,
  messageReceived,
  messageRemoved,
  messagesApi,
  presenceChanged,
  presenceSet,
  queryPresence,
  removeParticipant,
  renameGroup,
  resetMessages,
  sendMessage,
  setActiveConversation,
  startDirect,
  toChatListingModel,
  toConversationModel,
  toMessageModel,
  useMessagesSocket,
} from '@/features/messages';
import { marketplaceApi } from '@/features/user/marketplace';
import {
  CHAT_BASE_PATHS,
  CHAT_LISTING_PARAM,
  CHAT_SECTIONS,
  chatPath,
  chatTargetFor,
} from '@/shared/constants/chat';
import { marketplaceListingPath } from '@/shared/constants/marketplace';

const SEARCH_DEBOUNCE_MS = 300;
/** Fallback refresh while the realtime connection is down. */
const POLL_INTERVAL_MS = 20000;
const DESKTOP_QUERY = '(min-width: 1280px)';

const tabForSection = (section) => (section === CHAT_SECTIONS.GROUP ? 'groups' : 'messages');
const sectionForTab = (tab) => (tab === 'groups' ? CHAT_SECTIONS.GROUP : CHAT_SECTIONS.DIRECT);
const typeForTab = (tab) => (tab === 'groups' ? 'group' : 'direct');

/**
 * API-backed messenger shared by User, Supplier and Admin inboxes.
 * The URL is the source of truth (see `ChatLayout`): `section` picks the
 * tab and `targetId` the open conversation — the other user's id for direct
 * chats (opens the composer when no thread exists yet), the conversation id
 * for groups. `?listing=<id>` on a direct chat preloads that marketplace
 * listing into the composer (see `listingChatPath`).
 */
const MessagesContainer = ({
  variant = 'dashboard',
  basePath = CHAT_BASE_PATHS.USER,
  section = CHAT_SECTIONS.DIRECT,
  targetId = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  /** Direct target with no thread yet; the composer opens for it. */
  const [missingDirectId, setMissingDirectId] = useState(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const type = typeForTab(tab);
  const socketRef = useRef(null);
  const hasConnectedRef = useRef(false);

  useEffect(() => () => dispatch(resetMessages()), [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(fetchConversations({ type, search, page: 1 }));
  }, [dispatch, type, search]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearMessagesError());
  }, [error, dispatch]);

  const goTo = useCallback(
    (target, options) => navigate(chatPath(basePath, target), options),
    [navigate, basePath],
  );

  const listingParam =
    section === CHAT_SECTIONS.DIRECT && targetId ? searchParams.get(CHAT_LISTING_PARAM) : null;
  /** `{ id, listing }` from the marketplace API for `listingParam`. */
  const [loadedListing, setLoadedListing] = useState(null);

  const dropListingParam = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(CHAT_LISTING_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  useEffect(() => {
    if (!listingParam) return undefined;
    let cancelled = false;
    marketplaceApi
      .getListingById(listingParam)
      .then((listing) => {
        if (cancelled) return;
        const unavailable =
          listing?.status && listing.status !== 'ACTIVE' && listing.seller?.id !== currentUserId;
        if (!listing?.id || unavailable) {
          toast.error('That listing is no longer available');
          dropListingParam();
          return;
        }
        setLoadedListing({ id: listingParam, listing });
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(marketplaceApi.getApiErrorMessage(err, 'That listing is no longer available'));
        dropListingParam();
      });
    return () => {
      cancelled = true;
    };
  }, [listingParam, currentUserId, dropListingParam]);

  const pendingListing = useMemo(() => {
    if (!listingParam) return null;
    if (loadedListing?.id !== listingParam) return { id: listingParam, loading: true };
    return toChatListingModel(loadedListing.listing);
  }, [listingParam, loadedListing]);

  const getListingHref = useCallback(
    (listingId) => marketplaceListingPath(currentRole, listingId),
    [currentRole],
  );

  const conversationsRef = useRef(conversations);
  const activeIdRef = useRef(activeConversationId);
  useEffect(() => {
    conversationsRef.current = conversations;
    activeIdRef.current = activeConversationId;
  });

  // URL → open conversation. Runs on direct navigation, refresh and in-app links.
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
      toast.error('That conversation is no longer available');
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

  // Desktop: open the newest conversation of the current section when none is in the URL.
  useEffect(() => {
    if (targetId || conversationsLoading || conversations.length === 0) return;
    const first = conversations[0];
    if (Boolean(first.isGroup) !== (type === 'group')) return;
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const target = chatTargetFor(first);
    if (target) goTo(target, { replace: true });
  }, [targetId, conversationsLoading, conversations, type, goTo]);

  const refreshVisible = useCallback(() => {
    dispatch(fetchConversations({ type, search, page: 1, silent: true }));
    if (activeConversationId) {
      dispatch(fetchThread({ conversationId: activeConversationId, silent: true }));
    }
  }, [dispatch, type, search, activeConversationId]);

  const { connected } = useMessagesSocket({
    connect: (instance) => {
      socketRef.current = instance;
      // Catch up on anything missed while disconnected.
      if (hasConnectedRef.current) refreshVisible();
      hasConnectedRef.current = true;
    },
    'message:new': ({ conversationId, message }) => {
      const known = conversations.some((c) => c.id === conversationId);
      dispatch(messageReceived({ conversationId, message, currentUserId }));
      if (!known) dispatch(fetchConversation(conversationId));
      if (
        conversationId === activeConversationId &&
        message?.senderId !== currentUserId &&
        document.visibilityState === 'visible'
      ) {
        dispatch(markConversationRead(conversationId));
      }
    },
    'message:deleted': (payload) => {
      dispatch(messageRemoved(payload));
      dispatch(fetchConversation(payload.conversationId));
    },
    'conversation:new': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:updated': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:removed': ({ conversationId }) => {
      if (conversationId === activeConversationId) {
        toast.info('This conversation is no longer available');
        setInfoOpen(false);
        goTo({ section }, { replace: true });
      }
      dispatch(conversationRemoved(conversationId));
    },
    'conversation:read': (payload) => dispatch(conversationReadByOther(payload)),
    'presence:update': (payload) => dispatch(presenceChanged(payload)),
  });

  useEffect(() => {
    if (connected) return undefined;
    const timer = setInterval(refreshVisible, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [connected, refreshVisible]);

  const activeRaw =
    conversations.find((c) => c.id === activeConversationId) ||
    (activeDetail?.id === activeConversationId ? activeDetail : null);

  const presenceKey = useMemo(() => {
    const ids = new Set(
      conversations.filter((c) => !c.isGroup && c.otherUserId).map((c) => c.otherUserId),
    );
    (activeRaw?.participants || []).forEach((p) => {
      if (p.id !== currentUserId) ids.add(p.id);
    });
    return Array.from(ids).sort().join(',');
  }, [conversations, activeRaw, currentUserId]);

  useEffect(() => {
    if (!connected || !presenceKey) return undefined;
    let cancelled = false;
    queryPresence(socketRef.current, presenceKey.split(',')).then((ids) => {
      if (!cancelled) dispatch(presenceSet(ids));
    });
    return () => {
      cancelled = true;
    };
  }, [connected, presenceKey, dispatch]);

  const onlineSet = useMemo(() => new Set(onlineUserIds), [onlineUserIds]);

  const chats = useMemo(
    () =>
      conversations
        .map((c) => toConversationModel(c, { onlineUserIds: onlineSet }))
        .filter(Boolean),
    [conversations, onlineSet],
  );

  const messageModels = useMemo(
    () => messages.map((m) => toMessageModel(m, currentUserId)).filter(Boolean),
    [messages, currentUserId],
  );

  const activeModel = activeRaw
    ? toConversationModel(activeRaw, { onlineUserIds: onlineSet })
    : null;
  const activeChat = activeModel ? { ...activeModel, messages: messageModels } : null;
  const seen = isSeenByOther(activeRaw, messageModels, currentUserId);

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
    const conversation =
      conversations.find((c) => c.id === id) || (activeDetail?.id === id ? activeDetail : null);
    const target = chatTargetFor(conversation);
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
    setQuery('');
    setSearch('');
    goTo({ section: sectionForTab(nextTab) });
  };

  const handleSend = async ({ body, attachments, listingId }) => {
    if (!activeConversationId) return false;
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
    setMissingDirectId(null);
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
    openFreshThread(result.payload);
    return true;
  };

  const handleConfirmDelete = async () => {
    const messageId = pendingDeleteId;
    setPendingDeleteId(null);
    if (!activeConversationId || !messageId) return;
    await dispatch(deleteMessage({ conversationId: activeConversationId, messageId }));
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

  const runGroupAction = async (thunk, arg) => {
    const result = await dispatch(thunk(arg));
    return thunk.fulfilled.match(result);
  };

  const hasMoreChats =
    (conversationsMeta?.page ?? 1) < (conversationsMeta?.totalPages ?? 1);

  return (
    <>
      <MessagesPageContent
        variant={variant}
        tab={tab}
        onTabChange={handleTabChange}
        chats={chats}
        activeChat={activeChat}
        activeChatId={activeConversationId}
        onSelectChat={openChat}
        query={query}
        onSearchChange={setQuery}
        onSend={handleSend}
        sending={sending}
        onUploadFile={handleUploadFile}
        showNewMessageButton={tab === 'messages'}
        onNewMessage={() => setNewMessageOpen(true)}
        showCreateGroupButton={tab === 'groups'}
        onCreateGroup={() => setGroupModalOpen(true)}
        onLeave={() => setConfirmLeave(true)}
        onDeleteMessage={setPendingDeleteId}
        onOpenInfo={() => setInfoOpen(true)}
        loading={conversationsLoading}
        threadLoading={messagesLoading}
        hasMoreMessages={messagesHasMore}
        olderLoading={olderLoading}
        onLoadOlder={() =>
          dispatch(
            fetchThread({
              conversationId: activeConversationId,
              before: messages[0]?.time,
            }),
          )
        }
        hasMoreChats={hasMoreChats}
        loadingMoreChats={conversationsLoadingMore}
        onLoadMoreChats={() =>
          dispatch(
            fetchConversations({
              type,
              search,
              page: (conversationsMeta?.page ?? 1) + 1,
            }),
          )
        }
        seen={seen}
        pendingListing={composeUserId ? null : pendingListing}
        onRemovePendingListing={dropListingParam}
        getListingHref={getListingHref}
        mobilePanel={mobilePanel}
        onMobileBack={() => goTo({ section }, { replace: true })}
      />

      <NewMessageModal
        open={newMessageOpen || Boolean(composeUserId)}
        onClose={closeNewMessage}
        onSend={handleStartDirect}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        initialRecipientId={composeUserId}
        listing={composeUserId ? pendingListing : null}
        onRemoveListing={dropListingParam}
        submitting={actionLoading}
      />

      <CreateGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        submitting={actionLoading}
      />

      <ConversationInfoModal
        open={infoOpen}
        conversation={activeModel}
        currentUserId={currentUserId}
        onlineUserIds={onlineSet}
        onClose={() => setInfoOpen(false)}
        onRename={(name) =>
          runGroupAction(renameGroup, { conversationId: activeConversationId, name })
        }
        onAddMembers={(participantIds) =>
          runGroupAction(addParticipants, {
            conversationId: activeConversationId,
            participantIds,
          })
        }
        onRemoveMember={(userId) =>
          runGroupAction(removeParticipant, {
            conversationId: activeConversationId,
            userId,
          })
        }
        onLeave={() => setConfirmLeave(true)}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        busy={actionLoading}
      />

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete message?"
        description="This removes the message for everyone in the conversation."
        confirmLabel="Delete"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmModal
        open={confirmLeave}
        title="Leave group?"
        description="You will stop receiving messages from this group. Rejoining requires the owner to add you again."
        confirmLabel="Leave"
        confirming={actionLoading}
        onClose={() => setConfirmLeave(false)}
        onConfirm={handleConfirmLeave}
      />
    </>
  );
};

export default MessagesContainer;
