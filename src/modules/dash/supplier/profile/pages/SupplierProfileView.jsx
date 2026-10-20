import { ProfileSetupForm } from "@/modules/dash/user/profile";
import { ProfileSetupFormSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import { useSupplierProfile } from "../hooks/useSupplierProfile";

const SupplierProfileView = () => {
  const profile = useSupplierProfile();

  return (
    <PanelPage width="narrow">
      {profile.loading ? (
        <ProfileSetupFormSkeleton />
      ) : (
        <ProfileSetupForm
          values={profile.form}
          onChange={profile.setField}
          onSubmit={profile.submit}
          onUploadAvatar={profile.uploadAvatar}
          onUploadCover={profile.uploadCover}
          uploading={profile.uploading}
          countries={profile.countries}
          title="My Profile"
          subtitle="Update your supplier profile visible to laboratories and buyers."
          submitLabel={profile.saving ? "Saving…" : "Save Profile"}
          submitDisabled={profile.saving || profile.uploading}
        />
      )}
    </PanelPage>
  );
};

export default SupplierProfileView;
