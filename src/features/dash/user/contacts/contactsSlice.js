import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContactsList,
  fetchPendingRequestCount,
  fetchContactDetails,
  requestContactConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} from "./contactsThunks";
import { logoutUser } from "@/features/auth/authThunks";

/** Unfiltered Requests list, whose total is the badge count. */
const isIncomingRequestsQuery = (params) =>
  params?.status === "pending" &&
  params?.direction === "incoming" &&
  !params.search &&
  !params.country;

const decrementPendingRequests = (state) => {
  state.pendingRequestCount = Math.max(0, state.pendingRequestCount - 1);
};

const initialState = {
  pendingRequestCount: 0,
  pendingCountRequestId: null,
  contacts: [],
  contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedContact: null,
  contactsLoading: false,
  contactsRequestId: null,
  contactsError: null,
  selectedContactLoading: false,
  connectingId: null,
  acceptingId: null,
  actionLoading: false,
  error: null,
};

const markPendingOnContact = (contact, addresseeId) => {
  if (!contact || contact.id !== addresseeId) return contact;
  return {
    ...contact,
    connectionStatus: "PENDING",
    connectionDirection: "outgoing",
  };
};

/** Remove cards that no longer belong in the current tab and keep paging in sync. */
const dropFromList = (state, shouldDrop) => {
  const kept = state.contacts.filter((c) => !shouldDrop(c));
  const removed = state.contacts.length - kept.length;
  state.contacts = kept;
  if (removed === 0 || !(state.contactsMeta?.total > 0)) return;
  const total = Math.max(0, state.contactsMeta.total - removed);
  state.contactsMeta = {
    ...state.contactsMeta,
    total,
    totalPages: Math.max(
      1,
      Math.ceil(total / (state.contactsMeta.pageSize || 1)),
    ),
  };
};

const applyConnectionStatus = (contact, connectionId, status) => {
  if (!contact) return contact;
  const matches =
    contact.connectionId === connectionId ||
    contact.id === connectionId;
  if (!matches) return contact;
  return {
    ...contact,
    connectionStatus: status,
    connectionId: contact.connectionId || connectionId,
  };
};

const contactsSlice = createSlice({
  name: "userContacts",
  initialState,
  reducers: {
    clearContactsError: (state) => {
      state.error = null;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
    /** Sync: show skeletons before paint when filter/page/search changes */
    invalidateContactsList: (state) => {
      state.contactsLoading = true;
      state.contacts = [];
      state.contactsMeta = {
        ...state.contactsMeta,
        total: 0,
        totalPages: 1,
      };
      state.error = null;
      state.contactsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsList.pending, (state, action) => {
        if (action.meta.arg?.background) {
          // A page/filter load already in flight wins over a refresh.
          if (!state.contactsLoading) {
            state.contactsRequestId = action.meta.requestId;
          }
          return;
        }
        state.contactsRequestId = action.meta.requestId;
        state.contactsLoading = true;
        state.error = null;
        state.contactsError = null;
        // Drop previous tab/page results so the UI can show skeletons
        // instead of stale People cards while Requests (or vice versa) loads.
        state.contacts = [];
        state.contactsMeta = {
          ...state.contactsMeta,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchContactsList.fulfilled, (state, action) => {
        // Ignore responses for a page/filter the user has already left.
        if (action.meta.requestId !== state.contactsRequestId) return;
        state.contactsLoading = false;
        state.contacts = action.payload.data;
        state.contactsMeta = action.payload.meta;
        if (isIncomingRequestsQuery(action.meta.arg)) {
          state.pendingRequestCount = Number(action.payload.meta?.total) || 0;
        }
      })
      .addCase(fetchPendingRequestCount.pending, (state, action) => {
        state.pendingCountRequestId = action.meta.requestId;
      })
      .addCase(fetchPendingRequestCount.fulfilled, (state, action) => {
        if (state.pendingCountRequestId !== action.meta.requestId) return;
        state.pendingRequestCount = action.payload;
      })
      .addCase(fetchContactsList.rejected, (state, action) => {
        if (action.meta.requestId !== state.contactsRequestId) return;
        // Keep the visible page if only a background refresh failed.
        if (action.meta.arg?.background) return;
        state.contactsLoading = false;
        state.error = action.payload;
        state.contactsError = action.payload || "Failed to load contacts";
      })
      .addCase(fetchContactDetails.pending, (state) => {
        state.selectedContactLoading = true;
        state.error = null;
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.selectedContactLoading = false;
        state.selectedContact = action.payload;
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.selectedContactLoading = false;
        state.error = action.payload;
      })
      .addCase(requestContactConnection.pending, (state, action) => {
        state.connectingId = action.meta.arg;
        state.error = null;
      })
      .addCase(requestContactConnection.fulfilled, (state, action) => {
        state.connectingId = null;
        const { addresseeId } = action.payload;
        // Only People shows Connect; a sent request moves the member to Pending.
        dropFromList(state, (c) => c.id === addresseeId);
        state.selectedContact = markPendingOnContact(
          state.selectedContact,
          addresseeId,
        );
      })
      .addCase(requestContactConnection.rejected, (state, action) => {
        state.connectingId = null;
        state.error = action.payload;
      })
      .addCase(acceptConnection.pending, (state, action) => {
        state.actionLoading = true;
        state.acceptingId = action.meta.arg;
        state.error = null;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.acceptingId = null;
        decrementPendingRequests(state);
        const { connectionId } = action.payload;
        // Drop from Requests inbox; directory refetch will show Connected
        dropFromList(
          state,
          (c) => c.connectionId === connectionId || c.id === connectionId,
        );
        state.selectedContact = applyConnectionStatus(
          state.selectedContact,
          connectionId,
          "ACCEPTED",
        );
      })
      .addCase(acceptConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.acceptingId = null;
        state.error = action.payload;
      })
      .addCase(declineConnection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(declineConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        decrementPendingRequests(state);
        const { connectionId } = action.payload;
        state.contacts = state.contacts.filter(
          (c) =>
            c.connectionId !== connectionId && c.id !== connectionId,
        );
        if (
          state.selectedContact?.connectionId === connectionId ||
          state.selectedContact?.id === connectionId
        ) {
          state.selectedContact = null;
        }
      })
      .addCase(declineConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(removeConnection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { connectionId } = action.payload;
        state.contacts = state.contacts.filter(
          (c) =>
            c.connectionId !== connectionId && c.id !== connectionId,
        );
        if (
          state.selectedContact?.connectionId === connectionId ||
          state.selectedContact?.id === connectionId
        ) {
          state.selectedContact = null;
        }
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.pendingRequestCount = 0;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.pendingRequestCount = 0;
      });
  },
});

export const { clearContactsError, clearSelectedContact, invalidateContactsList } =
  contactsSlice.actions;

export const selectPendingRequestCount = (state) =>
  state.userContacts.pendingRequestCount ?? 0;
export default contactsSlice.reducer;
