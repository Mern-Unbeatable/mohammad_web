import { createSlice } from "@reduxjs/toolkit";
import { logoutUser, loginUser, registerUser } from "@/features/auth/authThunks";
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  fetchMemberProfile,
} from "./profileThunks";
import { emptyProfileForm, mapUserToForm } from "./profileMappers";

const initialState = {
  user: null,
  form: emptyProfileForm,
  memberProfile: null,
  loading: false,
  saving: false,
  changingPassword: false,
  memberLoading: false,
  error: null,
  saveError: null,
  memberError: null,
};

const profileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.saveError = null;
      state.memberError = null;
    },
    setProfileField: (state, action) => {
      const { key, value } = action.payload || {};
      if (!key) return;
      state.form = { ...state.form, [key]: value };
    },
    clearMemberProfile: (state) => {
      state.memberProfile = null;
      state.memberError = null;
    },
    resetUserProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.changingPassword = true;
        state.saveError = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.changingPassword = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.saveError = action.payload;
      })
      .addCase(fetchMemberProfile.pending, (state) => {
        state.memberLoading = true;
        state.memberError = null;
      })
      .addCase(fetchMemberProfile.fulfilled, (state, action) => {
        state.memberLoading = false;
        state.memberProfile = action.payload;
      })
      .addCase(fetchMemberProfile.rejected, (state, action) => {
        state.memberLoading = false;
        state.memberError = action.payload;
      })
      // Clear cached profile so a new session always reloads from the API
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState)
      .addCase(loginUser.fulfilled, () => initialState)
      .addCase(registerUser.fulfilled, () => initialState);
  },
});

export const {
  clearProfileError,
  setProfileField,
  clearMemberProfile,
  resetUserProfile,
} = profileSlice.actions;
export default profileSlice.reducer;
