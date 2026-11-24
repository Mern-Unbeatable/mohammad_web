import { createSlice } from "@reduxjs/toolkit";
import {
  fetchModerationConversations,
  fetchModerationConversation,
  fetchModerationThread,
  moderateDeleteMessage,
  moderateDeleteConversation,
} from "./adminMessagesThunks";

const initialState = {
  conversations: [],
  meta: { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  /** Type filter ("" = all) the loaded list belongs to. */
  listType: "",
  listLoading: false,
  loadingMore: false,
  /** Latest list request; responses from earlier ones are stale. */
  listRequestId: null,
  /** Why the first page failed to load (shown with a retry). */
  listError: null,
  selectedId: null,
  selected: null,
  messages: [],
  hasMore: false,
  threadLoading: false,
  olderLoading: false,
  deleting: false,
  error: null,
};

const adminMessagesSlice = createSlice({
  name: "adminMessages",
  initialState,
  reducers: {
    selectModerationConversation: (state, action) => {
      const id = action.payload || null;
      if (state.selectedId !== id) {
        state.messages = [];
        state.hasMore = false;
      }
      state.selectedId = id;
      state.selected = state.conversations.find((c) => c.id === id) || null;
    },
    clearAdminMessagesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModerationConversations.pending, (state, action) => {
        const { page = 1, type = "" } = action.meta.arg || {};
        state.error = null;
        state.listError = null;
        state.listRequestId = action.meta.requestId;
        if (type !== state.listType) {
          // Another filter: never show (or page) the previous filter's rows as this one's.
          state.listType = type;
          state.conversations = [];
          state.meta = initialState.meta;
          state.loadingMore = false;
        }
        if (page > 1) state.loadingMore = true;
        else state.listLoading = true;
      })
      .addCase(fetchModerationConversations.fulfilled, (state, action) => {
        const latest = state.listRequestId;
        if (latest && action.meta.requestId !== latest) return;
        const page = action.meta.arg?.page ?? 1;
        state.listLoading = false;
        state.loadingMore = false;
        if (page > 1) {
          const seen = new Set(state.conversations.map((c) => c.id));
          state.conversations.push(...action.payload.data.filter((c) => !seen.has(c.id)));
        } else {
          state.conversations = action.payload.data;
        }
        state.meta = action.payload.meta;
      })
      .addCase(fetchModerationConversations.rejected, (state, action) => {
        const latest = state.listRequestId;
        if (latest && action.meta.requestId !== latest) return;
        const message = action.payload || action.error?.message || "Something went wrong";
        state.listLoading = false;
        state.loadingMore = false;
        if ((action.meta.arg?.page ?? 1) > 1) state.error = message;
        else state.listError = message;
      })

      .addCase(fetchModerationConversation.fulfilled, (state, action) => {
        if (action.payload?.id === state.selectedId) state.selected = action.payload;
      })

      .addCase(fetchModerationThread.pending, (state, action) => {
        state.error = null;
        if (action.meta.arg?.before) state.olderLoading = true;
        else state.threadLoading = true;
      })
      .addCase(fetchModerationThread.fulfilled, (state, action) => {
        const { conversationId, data, hasMore } = action.payload;
        state.threadLoading = false;
        state.olderLoading = false;
        if (conversationId !== state.selectedId) return;
        state.messages = action.meta.arg?.before ? [...data, ...state.messages] : data;
        state.hasMore = hasMore;
      })
      .addCase(fetchModerationThread.rejected, (state, action) => {
        state.threadLoading = false;
        state.olderLoading = false;
        state.error = action.payload;
      })

      .addCase(moderateDeleteMessage.pending, (state) => {
        state.deleting = true;
      })
      .addCase(moderateDeleteMessage.fulfilled, (state, action) => {
        state.deleting = false;
        state.messages = state.messages.filter((m) => m.id !== action.payload.messageId);
        const conversation = state.conversations.find(
          (c) => c.id === action.payload.conversationId,
        );
        if (conversation) {
          conversation.messageCount = Math.max(0, conversation.messageCount - 1);
        }
      })
      .addCase(moderateDeleteMessage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(moderateDeleteConversation.pending, (state) => {
        state.deleting = true;
      })
      .addCase(moderateDeleteConversation.fulfilled, (state, action) => {
        state.deleting = false;
        const id = action.payload.conversationId;
        state.conversations = state.conversations.filter((c) => c.id !== id);
        state.meta.total = Math.max(0, (state.meta.total ?? 1) - 1);
        if (state.selectedId === id) {
          state.selectedId = null;
          state.selected = null;
          state.messages = [];
          state.hasMore = false;
        }
      })
      .addCase(moderateDeleteConversation.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { selectModerationConversation, clearAdminMessagesError } =
  adminMessagesSlice.actions;
export default adminMessagesSlice.reducer;
