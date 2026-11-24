import BackLink from "@/components/layout/BackLink";
import DashboardPage from "@/components/layout/DashboardPage";
import ProfileSetupForm from "../components/setup/ProfileSetupForm";
import ProfileSetupLoading from "@/components/loader/spinners/ProfileSetupLoading";
import { PROFILE_PATH } from "../constant/constants";
import { useProfileSetup } from "../hooks/useProfileSetup";

const ProfileSetupView = () => {
  const setup = useProfileSetup();

  return (
    <DashboardPage width="narrow" spacing="relaxed">
      <BackLink to={PROFILE_PATH} className="self-start">
        Back to profile
      </BackLink>
      {setup.loading ? (
        <ProfileSetupLoading />
      ) : (
        <ProfileSetupForm
          values={setup.form}
          onChange={setup.setField}
          onSubmit={setup.submit}
          onUploadAvatar={setup.uploadAvatar}
          onUploadCover={setup.uploadCover}
          uploading={setup.uploading}
          countries={setup.countries}
          submitLabel={setup.saving ? "Saving…" : undefined}
          submitDisabled={setup.saving || setup.uploading}
        />
      )}
    </DashboardPage>
  );
};

export default ProfileSetupView;
