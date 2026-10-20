import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminProfile,
  updateAdminProfile,
  updateAdminAvatar,
  changeAdminPassword,
} from "./profileThunks";
import { mapUserToForm } from "./profileMappers";

const emptyForm = {
  name: "",
  email: "",
  displayName: "",
  displayEmail: "",
  avatar: null,
  initials: "",
};

const initialState = {
  user: null,
  form: emptyForm,
  loading: false,
  savingProfile: false,
  uploadingAvatar: false,
  savingPassword: false,
  error: null,
  saveError: null,
};

const profileSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.saveError = null;
    },
    setProfileField: (state, action) => {
      const { key, value } = action.payload || {};
      if (!key) return;
      state.form = { ...state.form, [key]: value };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.savingProfile = true;
        state.saveError = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.savingProfile = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.savingProfile = false;
        state.saveError = action.payload;
      })
      .addCase(updateAdminAvatar.pending, (state) => {
        state.uploadingAvatar = true;
        state.saveError = null;
      })
      .addCase(updateAdminAvatar.fulfilled, (state, action) => {
        state.uploadingAvatar = false;
        state.user = action.payload;
        const { avatar, initials } = mapUserToForm(action.payload);
        // Keep any unsaved name edits in the form.
        state.form = { ...state.form, avatar, initials };
      })
      .addCase(updateAdminAvatar.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.saveError = action.payload;
      })
      .addCase(changeAdminPassword.pending, (state) => {
        state.savingPassword = true;
        state.saveError = null;
      })
      .addCase(changeAdminPassword.fulfilled, (state) => {
        state.savingPassword = false;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.savingPassword = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearProfileError, setProfileField } = profileSlice.actions;
export default profileSlice.reducer;
