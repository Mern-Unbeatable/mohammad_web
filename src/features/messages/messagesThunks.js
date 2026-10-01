import { createAsyncThunk } from "@reduxjs/toolkit";
import * as messagesApi from "./messagesApi";

/**
 * Messaging async thunks — orchestration only; HTTP in messagesApi.
 * Thunks accepting `silent: true` refresh data without toggling loading UI.
 */

const withError = (fallback, fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(messagesApi.getApiErrorMessage(err, fallback));
  }
};

const withoutSilent = (arg = {}) => {
  const params = { ...arg };
  delete params.silent;
  return params;
};

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  withError("Failed to load conversations", (arg) =>
    messagesApi.getConversations(withoutSilent(arg)),
  ),
);

export const fetchConversation = createAsyncThunk(
  "messages/fetchConversation",
  withError("Failed to load conversation", (conversationId) =>
    messagesApi.getConversation(conversationId),
  ),
);

export const fetchDirectConversation = createAsyncThunk(
  "messages/fetchDirectConversation",
  withError("Failed to open conversation", (userId) =>
    messagesApi.getDirectConversation(userId),
  ),
);

export const fetchThread = createAsyncThunk(
  "messages/fetchThread",
  withError("Failed to load messages", async (arg) => {
    const { conversationId, ...params } = withoutSilent(arg);
    const result = await messagesApi.getThread(conversationId, params);
    return { conversationId, ...result };
  }),
);

export const markConversationRead = createAsyncThunk(
  "messages/markRead",
  withError("Failed to mark conversation as read", (conversationId) =>
    messagesApi.markRead(conversationId),
  ),
);

/** Background badge refresh: failures are ignored, not surfaced as `state.error`. */
export const fetchUnreadSummary = createAsyncThunk(
  "messages/fetchUnreadSummary",
  withError("Failed to load unread messages", () => messagesApi.getUnreadSummary()),
);

export const fetchRecipients = createAsyncThunk(
  "messages/fetchRecipients",
  withError("Failed to load contacts", (params = {}) =>
    messagesApi.getRecipients(params),
  ),
);

export const startDirect = createAsyncThunk(
  "messages/startDirect",
  withError("Failed to start conversation", (payload) =>
    messagesApi.startDirect(payload),
  ),
);

export const createGroup = createAsyncThunk(
  "messages/createGroup",
  withError("Failed to create group", (payload) => messagesApi.createGroup(payload)),
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  withError(
    "Failed to send message",
    async ({ conversationId, body, attachments, listingId }) => {
      const message = await messagesApi.sendMessage(conversationId, {
        body,
        attachments,
        listingId,
      });
      return { conversationId, message };
    },
  ),
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  withError("Failed to delete message", ({ conversationId, messageId }) =>
    messagesApi.deleteMessage(conversationId, messageId),
  ),
);

export const leaveConversation = createAsyncThunk(
  "messages/leaveConversation",
  withError("Failed to leave conversation", (conversationId) =>
    messagesApi.leaveConversation(conversationId),
  ),
);

export const renameGroup = createAsyncThunk(
  "messages/renameGroup",
  withError("Failed to rename group", ({ conversationId, name }) =>
    messagesApi.renameGroup(conversationId, name),
  ),
);

export const addParticipants = createAsyncThunk(
  "messages/addParticipants",
  withError("Failed to add members", ({ conversationId, participantIds }) =>
    messagesApi.addParticipants(conversationId, participantIds),
  ),
);

export const removeParticipant = createAsyncThunk(
  "messages/removeParticipant",
  withError("Failed to remove member", ({ conversationId, userId }) =>
    messagesApi.removeParticipant(conversationId, userId),
  ),
);
