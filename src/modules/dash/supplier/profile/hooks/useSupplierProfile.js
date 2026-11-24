import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { profileCountries } from "@/modules/dash/user/data/subscription";
import {
  fetchSupplierProfile,
  updateSupplierProfile,
  clearProfileError,
  setProfileField,
  profileApi,
} from "@/features/dash/supplier/profile";
import { IMAGE_FIELD } from "../constant/constants";
import {
  countryOptions,
  isProfileImage,
  profileFormError,
  uploadSuccessMessage,
} from "../utils/profileForm";

/** Supplier profile form: load, field changes, avatar / cover upload and save. */
export const useSupplierProfile = () => {
  const dispatch = useDispatch();
  const { form, loading, saving, error, saveError } = useSelector(
    (state) => state.supplierProfile,
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchSupplierProfile());
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
      toast.success(uploadSuccessMessage(fieldKey));
    } catch (err) {
      toast.error(profileApi.getApiErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
    }
  };

  /** Failures are toasted by the `saveError` effect above. */
  const submit = async (e) => {
    e.preventDefault();
    if (saving || uploading) return;

    const invalid = profileFormError(form);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    const result = await dispatch(updateSupplierProfile(form));
    if (updateSupplierProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    }
  };

  return {
    form,
    loading,
    saving,
    uploading,
    countries,
    setField,
    uploadAvatar: (file) => uploadImage(IMAGE_FIELD.AVATAR, file),
    uploadCover: (file) => uploadImage(IMAGE_FIELD.COVER, file),
    submit,
  };
};
