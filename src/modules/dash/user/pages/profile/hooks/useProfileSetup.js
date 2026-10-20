import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { profileCountries } from "@/modules/dash/user/data/subscription";
import {
  fetchUserProfile,
  updateUserProfile,
  clearProfileError,
  setProfileField,
  profileApi,
} from "@/features/user/profile";
import { PROFILE_PATH } from "../constant/constants";
import { countryOptions, isProfileImage, profileFormError } from "../utils/profileSetup";

/** Edit-profile form: load, field changes, avatar / cover upload and save. */
export function useProfileSetup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, loading, saving, error, saveError } = useSelector(
    (state) => state.userProfile,
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  const countries = useMemo(
    () => countryOptions(form.country, profileCountries),
    [form.country],
  );

  const setField = (key, value) => dispatch(setProfileField({ key, value }));

  const uploadImage = async (fieldKey, file) => {
    if (!file || uploading || saving) return;
    if (!isProfileImage(file)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    setUploading(true);
    try {
      const data = await profileApi.uploadFile(file);
      setField(fieldKey, data.url);
      toast.success(fieldKey === "avatarUrl" ? "Profile photo ready" : "Cover photo ready");
    } catch (err) {
      toast.error(profileApi.getApiErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving || uploading) return;

    const invalid = profileFormError(form);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    const result = await dispatch(updateUserProfile(form));
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      navigate(PROFILE_PATH);
      return;
    }
    toast.error(result.payload || "Failed to update profile");
  };

  return {
    form,
    loading,
    saving,
    uploading,
    countries,
    setField,
    uploadAvatar: (file) => uploadImage("avatarUrl", file),
    uploadCover: (file) => uploadImage("coverUrl", file),
    submit,
  };
}
