import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ProfileSetupForm from "@/components/forms/ProfileSetupForm/ProfileSetupForm";
import { ProfileSetupFormSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import { profileCountries } from "@/modules/dash/user/data/subscription";
import {
  fetchSupplierProfile,
  updateSupplierProfile,
  clearProfileError,
  setProfileField,
  profileApi,
} from "@/features/dash/supplier/profile";

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const SupplierProfileView = () => {
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

  const countries = useMemo(() => {
    if (form.country && !profileCountries.includes(form.country)) {
      return [form.country, ...profileCountries];
    }
    return profileCountries;
  }, [form.country]);

  const uploadImage = async (fieldKey, file) => {
    if (!file || uploading || saving) return;
    if (!IMAGE_MIME.has(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    setUploading(true);
    try {
      const data = await profileApi.uploadFile(file);
      dispatch(setProfileField({ key: fieldKey, value: data.url }));
      toast.success(
        fieldKey === "avatarUrl" ? "Profile photo ready" : "Cover photo ready",
      );
    } catch (err) {
      toast.error(
        profileApi.getApiErrorMessage(err, "Failed to upload image"),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || uploading) return;

    if (!form.firstName?.trim() || !form.lastName?.trim()) {
      toast.error("First and last name are required");
      return;
    }

    const result = await dispatch(updateSupplierProfile(form));
    if (updateSupplierProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    }
  };

  if (loading) {
    return (
      <PanelPage width="narrow">
        <ProfileSetupFormSkeleton />
      </PanelPage>
    );
  }

  return (
    <PanelPage width="narrow">
      <ProfileSetupForm
        values={form}
        onChange={(key, value) => dispatch(setProfileField({ key, value }))}
        onSubmit={handleSubmit}
        onUploadAvatar={(file) => uploadImage("avatarUrl", file)}
        onUploadCover={(file) => uploadImage("coverUrl", file)}
        uploading={uploading}
        countries={countries}
        title="My Profile"
        subtitle="Update your supplier profile visible to laboratories and buyers."
        submitLabel={saving ? "Saving…" : "Save Profile"}
        submitDisabled={saving || uploading}
      />
    </PanelPage>
  );
};

export default SupplierProfileView;
