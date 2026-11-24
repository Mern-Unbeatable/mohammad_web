import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  changeAdminPassword,
  clearProfileError,
  fetchAdminProfile,
  setProfileField,
  updateAdminAvatar,
  updateAdminProfile,
} from "@/features/dash/admin/profile";
import { avatarFileError, passwordError, toPasswordPayload } from "../utils/profileForm";
import { EMPTY_PASSWORDS, MESSAGES } from "../constant/constants";

const ignoreSubmit = (e) => e.preventDefault();

/** Loads the admin's profile; name / avatar / password updates with toasts. */
export const useAdminProfile = () => {
  const dispatch = useDispatch();
  const { form, loading, savingProfile, uploadingAvatar, savingPassword, error, saveError } =
    useSelector((state) => state.adminProfile);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  const changeProfileField = (key, value) => dispatch(setProfileField({ key, value }));
  const changePasswordField = (key, value) =>
    setPasswords((prev) => ({ ...prev, [key]: value }));

  const updateProfile = async (e) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) {
      toast.error(MESSAGES.NAME_REQUIRED);
      return;
    }
    const result = await dispatch(updateAdminProfile(trimmed));
    if (updateAdminProfile.fulfilled.match(result)) toast.success(MESSAGES.PROFILE_UPDATED);
  };

  const changeAvatar = async (file) => {
    if (uploadingAvatar) return;
    const invalid = avatarFileError(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    const result = await dispatch(updateAdminAvatar(file));
    if (updateAdminAvatar.fulfilled.match(result)) toast.success(MESSAGES.AVATAR_UPDATED);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const invalid = passwordError(passwords);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    const result = await dispatch(changeAdminPassword(toPasswordPayload(passwords)));
    if (changeAdminPassword.fulfilled.match(result)) {
      setPasswords(EMPTY_PASSWORDS);
      toast.success(MESSAGES.PASSWORD_UPDATED);
    }
  };

  return {
    loading,
    form,
    passwords,
    changeProfileField,
    changePasswordField,
    updateProfile: savingProfile ? ignoreSubmit : updateProfile,
    changePassword: savingPassword ? ignoreSubmit : changePassword,
    changeAvatar,
    uploadingAvatar,
  };
};
