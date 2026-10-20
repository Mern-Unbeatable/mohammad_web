import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSupplierProfile,
  updateSupplierProfile,
  changeSupplierPassword,
} from "./profileThunks";
import { emptyProfileForm, mapUserToForm } from "./profileMappers";

const initialState = {
  user: null,
  form: emptyProfileForm,
  loading: false,
  saving: false,
  changingPassword: false,
  error: null,
  saveError: null,
};

const profileSlice = createSlice({
  name: "supplierProfile",
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
      .addCase(fetchSupplierProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(fetchSupplierProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSupplierProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateSupplierProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.user = action.payload;
        state.form = mapUserToForm(action.payload);
      })
      .addCase(updateSupplierProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      })
      .addCase(changeSupplierPassword.pending, (state) => {
        state.changingPassword = true;
        state.saveError = null;
      })
      .addCase(changeSupplierPassword.fulfilled, (state) => {
        state.changingPassword = false;
      })
      .addCase(changeSupplierPassword.rejected, (state, action) => {
        state.changingPassword = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearProfileError, setProfileField } = profileSlice.actions;
export default profileSlice.reducer;
