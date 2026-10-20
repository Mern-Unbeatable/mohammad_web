import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMySubscription,
  fetchPlans,
  subscribe,
  confirmCheckout,
  cancelSubscription,
} from "./subscriptionsThunks";

const initialState = {
  subscription: null,
  plans: null,
  loading: false,
  plansLoading: false,
  saving: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: "userSubscriptions",
  initialState,
  reducers: {
    clearSubscriptionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchMySubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlans.pending, (state) => {
        state.plansLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plansLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.plansLoading = false;
        state.error = action.payload;
      })
      .addCase(subscribe.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.saving = false;
        state.subscription =
          action.payload?.subscription || action.payload || null;
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(confirmCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(confirmCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.saving = false;
        state.subscription = action.payload;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubscriptionsError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
