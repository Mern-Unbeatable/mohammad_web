import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Contacts async thunks — orchestration only; HTTP in the role's contactsApi.
 * `prefix` is the role's slice name (action types stay `<prefix>/<thunk>`).
 * `api` is read at call time so tests can mock the role's contactsApi module.
 */
export function createContactsThunks(prefix, api) {
  /**
   * `background: true` refreshes the current page without clearing the cards
   * (e.g. after a connect or confirm shifts later members onto this page).
   */
  const fetchContactsList = createAsyncThunk(
    `${prefix}/fetchContactsList`,
    async (args = {}, { rejectWithValue }) => {
      const { background: _background, ...params } = args;
      try {
        return await api.getContactsList(params);
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to load contacts"),
        );
      }
    },
  );

  /** Background badge refresh; touches only `pendingRequestCount`. */
  const fetchPendingRequestCount = createAsyncThunk(
    `${prefix}/fetchPendingRequestCount`,
    async (_, { rejectWithValue }) => {
      try {
        return await api.getPendingRequestCount();
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to load requests"),
        );
      }
    },
  );

  const fetchContactDetails = createAsyncThunk(
    `${prefix}/fetchContactDetails`,
    async (contactId, { rejectWithValue }) => {
      try {
        return await api.getContactById(contactId);
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to load contact"),
        );
      }
    },
  );

  const requestContactConnection = createAsyncThunk(
    `${prefix}/requestContactConnection`,
    async (addresseeId, { rejectWithValue }) => {
      try {
        const connection = await api.requestConnection(addresseeId);
        return { addresseeId, connection };
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to send connection request"),
        );
      }
    },
  );

  const acceptConnection = createAsyncThunk(
    `${prefix}/acceptConnection`,
    async (connectionId, { rejectWithValue }) => {
      try {
        const connection = await api.acceptConnection(connectionId);
        return { connectionId, connection };
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to accept connection"),
        );
      }
    },
  );

  const declineConnection = createAsyncThunk(
    `${prefix}/declineConnection`,
    async (connectionId, { rejectWithValue }) => {
      try {
        const connection = await api.declineConnection(connectionId);
        return { connectionId, connection };
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to decline connection"),
        );
      }
    },
  );

  const removeConnection = createAsyncThunk(
    `${prefix}/removeConnection`,
    async (connectionId, { rejectWithValue }) => {
      try {
        return await api.removeConnection(connectionId);
      } catch (err) {
        return rejectWithValue(
          api.getApiErrorMessage(err, "Failed to remove connection"),
        );
      }
    },
  );

  return {
    fetchContactsList,
    fetchPendingRequestCount,
    fetchContactDetails,
    requestContactConnection,
    acceptConnection,
    declineConnection,
    removeConnection,
  };
}
