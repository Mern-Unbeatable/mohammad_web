import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchConversation,
  fetchDirectConversation,
  fetchThread,
  markConversationRead,
  fetchRecipients,
  startDirect,
  createGroup,
  sendMessage,
  editMessage,
  deleteMessage,
  leaveConversation,
  renameGroup,
  addParticipants,
  removeParticipant,
  fetchUnreadSummary,
} from "./messagesThunks";
import { logoutUser } from "../auth/authThunks";
import { messagePreview } from "./messagesMappers";

const initialUnread = { messages: 0, conversations: 0, loaded: false, requestId: null };

export const initialState = {
  /** Account-wide unread totals for the nav badge; survives `resetMessages`. */
  unread: initialUnread,
  /** "direct" | "group" — the tab the loaded list belongs to. */
  listType: "direct",
  conversations: [],
  conversationsMeta: { page: 1, pageSize: 30, total: 0, totalPages: 1 },
  conversationsLoading: false,
  conversationsLoadingMore: false,
  /** Latest visible list request; responses from earlier ones are stale. */
  conversationsRequestId: null,
  /** Why the current tab's first page failed to load (shown with a retry). */
  conversationsError: null,
  activeConversationId: null,
  /** Latest detail of the active conversation, even if it is not in the loaded list page. */
  activeDetail: null,
  messages: [],
  messagesHasMore: false,
  messagesLoading: false,
  olderLoading: false,
  recipients: [],
  recipientsLoading: false,
  recipientsRequestId: null,
  onlineUserIds: [],
  sending: false,
  actionLoading: false,
  error: null,
};

const typeOf = (conversation) => (conversation?.isGroup ? "group" : "direct");

const byTimeDesc = (a, b) => new Date(b.time) - new Date(a.time);

/** Insert/replace a conversation if it belongs to the loaded tab, keeping newest first. */
const upsertConversation = (state, conversation) => {
  if (!conversation?.id) return;
  if (conversation.id === state.activeConversationId) state.activeDetail = conversation;
  const index = state.conversations.findIndex((row) => row.id === conversation.id);
  if (typeOf(conversation) !== state.listType) {
    if (index >= 0) state.conversations.splice(index, 1);
    return;
  }
  if (index >= 0) state.conversations[index] = conversation;
  else state.conversations.push(conversation);
  state.conversations.sort(byTimeDesc);
};

const removeConversation = (state, conversationId) => {
  state.conversations = state.conversations.filter((c) => c.id !== conversationId);
  if (state.activeConversationId === conversationId) {
    state.activeConversationId = null;
    state.activeDetail = null;
    state.messages = [];
    state.messagesHasMore = false;
  }
};

const appendMessage = (state, message) => {
  if (!message?.id || state.messages.some((m) => m.id === message.id)) return;
  state.messages.push(message);
};

const bumpConversation = (state, conversationId, message) => {
  const conversation = state.conversations.find((c) => c.id === conversationId);
  if (!conversation) return null;
  conversation.preview = messagePreview(message);
  conversation.time = message.time;
  state.conversations.sort(byTimeDesc);
  return conversation;
};

/** Zeroes a conversation's unread count and removes it from the nav totals. */
const clearUnread = (state, conversation) => {
  const count = conversation?.unreadCount ?? 0;
  if (count <= 0) return;
  conversation.unreadCount = 0;
  state.unread.messages = Math.max(0, state.unread.messages - count);
  state.unread.conversations = Math.max(0, state.unread.conversations - 1);
};

const setPending = (key) => (state) => {
  state[key] = true;
  state.error = null;
};

const setRejected = (key) => (state, action) => {
  state[key] = false;
  state.error = action.payload || action.error?.message || "Something went wrong";
};

/** Edits only change text and `editedAt`; `from` stays as loaded (it is viewer-relative). */
const applyMessageEdit = (state, { conversationId, message } = {}) => {
  if (!message?.id || state.activeConversationId !== conversationId) return;
  const existing = state.messages.find((m) => m.id === message.id);
  if (!existing) return;
  existing.body = message.body;
  existing.editedAt = message.editedAt ?? null;
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessagesError: (state) => {
      state.error = null;
    },
    setActiveConversation: (state, action) => {
      const id = action.payload || null;
      if (state.activeConversationId !== id) {
        state.messages = [];
        state.messagesHasMore = false;
      }
      state.activeConversationId = id;
      const conversation = state.conversations.find((c) => c.id === id);
      clearUnread(state, conversation);
      if (state.activeDetail?.id !== id) state.activeDetail = conversation || null;
    },
    resetMessages: (state) => ({ ...initialState, unread: state.unread }),

    /** Realtime: `message:new`. Payload carries the current user id for unread math. */
    messageReceived: (state, action) => {
      const { conversationId, message, currentUserId } = action.payload;
      const conversation = bumpConversation(state, conversationId, message);
      const isActive = state.activeConversationId === conversationId;
      if (isActive) appendMessage(state, message);
      if (
        conversation &&
        !isActive &&
        message.senderId !== currentUserId &&
        message.type !== "SYSTEM"
      ) {
        if (!conversation.unreadCount) state.unread.conversations += 1;
        conversation.unreadCount = (conversation.unreadCount ?? 0) + 1;
        state.unread.messages += 1;
      }
    },
    /** Realtime: `message:updated` (an edit by the sender). */
    messageUpdated: (state, action) => {
      applyMessageEdit(state, action.payload);
    },
    messageRemoved: (state, action) => {
      const { conversationId, messageId } = action.payload;
      if (state.activeConversationId === conversationId) {
        state.messages = state.messages.filter((m) => m.id !== messageId);
      }
    },
    conversationRemoved: (state, action) => {
      removeConversation(state, action.payload);
    },
    conversationReadByOther: (state, action) => {
      const { conversationId, userId, lastReadAt } = action.payload;
      [
        state.conversations.find((c) => c.id === conversationId),
        state.activeDetail?.id === conversationId ? state.activeDetail : null,
      ].forEach((conversation) => {
        const participant = conversation?.participants?.find((p) => p.id === userId);
        if (participant) participant.lastReadAt = lastReadAt;
      });
    },
    presenceSet: (state, action) => {
      state.onlineUserIds = Array.from(new Set(action.payload || []));
    },
    presenceChanged: (state, action) => {
      const { userId, online } = action.payload;
      const others = state.onlineUserIds.filter((id) => id !== userId);
      state.onlineUserIds = online ? [...others, userId] : others;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state, action) => {
        const { page = 1, silent, type } = action.meta.arg || {};
        // Background refreshes never switch tabs or touch loading state.
        if (silent) return;
        state.error = null;
        state.conversationsError = null;
        state.conversationsRequestId = action.meta.requestId;
        if (type && type !== state.listType) {
          // Another tab: drop the previous tab's rows and pagination so they
          // are not shown (or paged) as this tab's list while it loads.
          state.listType = type;
          state.conversations = [];
          state.conversationsMeta = initialState.conversationsMeta;
          state.conversationsLoadingMore = false;
        }
        if (page > 1) state.conversationsLoadingMore = true;
        else state.conversationsLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        const { page = 1, silent, type } = action.meta.arg || {};
        if (type && type !== state.listType) return;
        if (silent) {
          // A visible request in flight will bring fresher data.
          if (state.conversationsLoading || state.conversationsLoadingMore) return;
        } else {
          const latest = state.conversationsRequestId;
          if (latest && action.meta.requestId !== latest) return;
          state.conversationsLoading = false;
          state.conversationsLoadingMore = false;
        }
        const rows = action.payload.data;
        if (page > 1) {
          const seen = new Set(state.conversations.map((c) => c.id));
          state.conversations.push(...rows.filter((c) => !seen.has(c.id)));
        } else {
          state.conversations = rows;
        }
        state.conversationsMeta = action.payload.meta;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        const { page = 1, silent } = action.meta.arg || {};
        // Failed background refreshes are retried by the next poll or reconnect.
        if (silent) return;
        const latest = state.conversationsRequestId;
        if (latest && action.meta.requestId !== latest) return;
        const message = action.payload || action.error?.message || "Something went wrong";
        state.conversationsLoading = false;
        state.conversationsLoadingMore = false;
        if (page > 1) state.error = message;
        else state.conversationsError = message;
      })

      .addCase(fetchConversation.fulfilled, (state, action) => {
        upsertConversation(state, action.payload);
      })
      .addCase(fetchDirectConversation.fulfilled, (state, action) => {
        if (action.payload) upsertConversation(state, action.payload);
      })

      .addCase(fetchThread.pending, (state, action) => {
        const { before, silent } = action.meta.arg || {};
        state.error = null;
        if (silent) return;
        if (before) state.olderLoading = true;
        else state.messagesLoading = true;
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        const { conversationId, data, hasMore } = action.payload;
        const { before } = action.meta.arg || {};
        state.messagesLoading = false;
        state.olderLoading = false;
        if (state.activeConversationId !== conversationId) return;
        if (before) {
          const seen = new Set(state.messages.map((m) => m.id));
          state.messages = [...data.filter((m) => !seen.has(m.id)), ...state.messages];
        } else {
          const fetchedIds = new Set(data.map((m) => m.id));
          const newerLocal = state.messages.filter(
            (m) =>
              !fetchedIds.has(m.id) &&
              data.length > 0 &&
              new Date(m.time) > new Date(data[data.length - 1].time),
          );
          state.messages = [...data, ...newerLocal];
        }
        state.messagesHasMore = hasMore;
        if (!before) {
          clearUnread(state, state.conversations.find((c) => c.id === conversationId));
        }
      })
      .addCase(fetchThread.rejected, (state, action) => {
        state.olderLoading = false;
        setRejected("messagesLoading")(state, action);
      })

      .addCase(markConversationRead.fulfilled, (state, action) => {
        clearUnread(
          state,
          state.conversations.find((c) => c.id === action.payload?.conversationId),
        );
      })

      .addCase(fetchUnreadSummary.pending, (state, action) => {
        state.unread.requestId = action.meta.requestId;
      })
      .addCase(fetchUnreadSummary.fulfilled, (state, action) => {
        // Only the latest request may overwrite locally adjusted totals.
        if (state.unread.requestId !== action.meta.requestId) return;
        state.unread.messages = action.payload.messages;
        state.unread.conversations = action.payload.conversations;
        state.unread.loaded = true;
      })

      .addCase(fetchRecipients.pending, (state, action) => {
        setPending("recipientsLoading")(state);
        state.recipientsRequestId = action.meta.requestId;
      })
      // Searches race while typing; only the latest one may update the list.
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        if (state.recipientsRequestId !== action.meta.requestId) return;
        state.recipientsLoading = false;
        state.recipients = action.payload;
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        if (state.recipientsRequestId !== action.meta.requestId) return;
        setRejected("recipientsLoading")(state, action);
      })

      .addCase(sendMessage.pending, setPending("sending"))
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        state.sending = false;
        bumpConversation(state, conversationId, message);
        if (state.activeConversationId === conversationId) appendMessage(state, message);
      })
      .addCase(sendMessage.rejected, setRejected("sending"))

      .addCase(editMessage.fulfilled, (state, action) => {
        applyMessageEdit(state, action.payload);
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { conversationId, messageId } = action.payload;
        if (state.activeConversationId === conversationId) {
          state.messages = state.messages.filter((m) => m.id !== messageId);
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(leaveConversation.fulfilled, (state, action) => {
        state.actionLoading = false;
        removeConversation(state, action.payload.conversationId);
      });

    // Actions that return an updated conversation and make it active.
    [startDirect, createGroup].forEach((thunk) => {
      builder
        .addCase(thunk.pending, setPending("actionLoading"))
        .addCase(thunk.fulfilled, (state, action) => {
          state.actionLoading = false;
          const conversation = action.payload;
          state.listType = typeOf(conversation);
          if (state.activeConversationId !== conversation?.id) {
            state.messages = [];
            state.messagesHasMore = false;
          }
          state.activeConversationId = conversation?.id || null;
          upsertConversation(state, conversation);
        })
        .addCase(thunk.rejected, setRejected("actionLoading"));
    });

    // Group management returns the refreshed conversation.
    [renameGroup, addParticipants, removeParticipant].forEach((thunk) => {
      builder
        .addCase(thunk.pending, setPending("actionLoading"))
        .addCase(thunk.fulfilled, (state, action) => {
          state.actionLoading = false;
          upsertConversation(state, action.payload);
        })
        .addCase(thunk.rejected, setRejected("actionLoading"));
    });

    builder
      .addCase(leaveConversation.pending, setPending("actionLoading"))
      .addCase(leaveConversation.rejected, setRejected("actionLoading"))
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState);
  },
});

export const {
  clearMessagesError,
  setActiveConversation,
  resetMessages,
  messageReceived,
  messageUpdated,
  messageRemoved,
  conversationRemoved,
  conversationReadByOther,
  presenceSet,
  presenceChanged,
} = messagesSlice.actions;

export default messagesSlice.reducer;
