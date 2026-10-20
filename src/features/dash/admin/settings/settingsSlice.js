import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminSettings, saveAdminSetting } from "./settingsThunks";

const initialState = {
  settings: {},
  loading: false,
  /** requestId of the last successful load — keys the settings form remount. */
  loadedRequestId: null,
  savingKey: null,
  error: null,
  saveError: null,
};

const settingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload || {};
        state.loadedRequestId = action.meta.requestId;
      })
      .addCase(fetchAdminSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveAdminSetting.pending, (state, action) => {
        state.savingKey = action.meta.arg?.key ?? null;
        state.saveError = null;
      })
      .addCase(saveAdminSetting.fulfilled, (state, action) => {
        state.savingKey = null;
        const { key, value } = action.payload;
        state.settings = { ...state.settings, [key]: value };
      })
      .addCase(saveAdminSetting.rejected, (state, action) => {
        state.savingKey = null;
        state.saveError = action.payload;
      });
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
