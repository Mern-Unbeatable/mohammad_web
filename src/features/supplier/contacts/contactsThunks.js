import { createAsyncThunk } from "@reduxjs/toolkit";
import * as contactsApi from "./contactsApi";

/**
 * Supplier contacts async thunks — orchestration only; HTTP in contactsApi.
 */

export const fetchContactsList = createAsyncThunk(
  "supplierContacts/fetchContactsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await contactsApi.getContactsList(params);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load contacts"),
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
