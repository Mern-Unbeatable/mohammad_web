import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsersList,
  fetchUserDetails,
  updateUserStatus,
} from "./usersThunks";

const initialState = {
  users: [],
  usersMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedUser: null,
  usersLoading: false,
  selectedUserLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users list
      .addCase(fetchUsersList.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersMeta = action.payload.meta;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      // User detail
      .addCase(fetchUserDetails.pending, (state) => {
        state.selectedUserLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.error = action.payload;
      })
      // User status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        if (state.selectedUser?.id === userId) {
          state.selectedUser.status = status;
        }
        const target = state.users.find((u) => u.id === userId);
        if (target) target.status = status;
      });
  },
});

export const { clearUsersError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
