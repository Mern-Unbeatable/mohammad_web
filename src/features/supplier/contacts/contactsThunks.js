import { createAsyncThunk } from "@reduxjs/toolkit";
import * as contactsApi from "./contactsApi";

/**
 * Supplier contacts async thunks — orchestration only; HTTP in contactsApi.
 */

/**
 * `background: true` refreshes the current page without clearing the cards
 * (e.g. after a connect or confirm shifts later members onto this page).
 */
export const fetchContactsList = createAsyncThunk(
  "supplierContacts/fetchContactsList",
  async (args = {}, { rejectWithValue }) => {
    const { background: _background, ...params } = args;
    try {
      return await contactsApi.getContactsList(params);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load contacts"),
      );
    }
  },
);

/** Background badge refresh; touches only `pendingRequestCount`. */
export const fetchPendingRequestCount = createAsyncThunk(
  "supplierContacts/fetchPendingRequestCount",
  async (_, { rejectWithValue }) => {
    try {
      return await contactsApi.getPendingRequestCount();
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load requests"),
      );
    }
  },
);

export const fetchContactDetails = createAsyncThunk(
  "supplierContacts/fetchContactDetails",
  async (contactId, { rejectWithValue }) => {
    try {
      return await contactsApi.getContactById(contactId);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load contact"),
      );
    }
  },
);

export const requestContactConnection = createAsyncThunk(
  "supplierContacts/requestContactConnection",
  async (addresseeId, { rejectWithValue }) => {
    try {
      const connection = await contactsApi.requestConnection(addresseeId);
      return { addresseeId, connection };
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to send connection request"),
      );
    }
  },
);

export const acceptConnection = createAsyncThunk(
  "supplierContacts/acceptConnection",
  async (connectionId, { rejectWithValue }) => {
    try {
      const connection = await contactsApi.acceptConnection(connectionId);
      return { connectionId, connection };
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to accept connection"),
      );
    }
  },
);

export const declineConnection = createAsyncThunk(
  "supplierContacts/declineConnection",
  async (connectionId, { rejectWithValue }) => {
    try {
      const connection = await contactsApi.declineConnection(connectionId);
      return { connectionId, connection };
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to decline connection"),
      );
    }
  },
);

export const removeConnection = createAsyncThunk(
  "supplierContacts/removeConnection",
  async (connectionId, { rejectWithValue }) => {
    try {
      return await contactsApi.removeConnection(connectionId);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to remove connection"),
      );
    }
  },
);
