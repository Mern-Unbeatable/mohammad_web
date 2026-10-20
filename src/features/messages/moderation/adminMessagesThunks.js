import { createAsyncThunk } from "@reduxjs/toolkit";
import * as adminMessagesApi from "./adminMessagesApi";

const withError = (fallback, fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(adminMessagesApi.getApiErrorMessage(err, fallback));
  }
};

export const fetchModerationConversations = createAsyncThunk(
  "adminMessages/fetchConversations",
  withError("Failed to load conversations", (params = {}) =>
    adminMessagesApi.getConversations(params),
  ),
);

export const fetchModerationConversation = createAsyncThunk(
  "adminMessages/fetchConversation",
  withError("Failed to load conversation", (conversationId) =>
    adminMessagesApi.getConversation(conversationId),
  ),
);

export const fetchModerationThread = createAsyncThunk(
  "adminMessages/fetchThread",
  withError("Failed to load messages", async ({ conversationId, before }) => {
    const result = await adminMessagesApi.getThread(
      conversationId,
      before ? { before } : {},
    );
    return { conversationId, ...result };
  }),
);

export const moderateDeleteMessage = createAsyncThunk(
  "adminMessages/deleteMessage",
  withError("Failed to delete message", ({ conversationId, messageId }) =>
    adminMessagesApi.deleteMessage(conversationId, messageId),
  ),
);

export const moderateDeleteConversation = createAsyncThunk(
  "adminMessages/deleteConversation",
  withError("Failed to delete conversation", (conversationId) =>
    adminMessagesApi.deleteConversation(conversationId),
  ),
);
