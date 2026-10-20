import Container from "@/components/ui/Container";
import ProfileSetupForm from "@/components/forms/ProfileSetupForm/ProfileSetupForm";
import ProfileSetupLoading from "./components/layout/ProfileSetupLoading";
import { useProfileSetup } from "./hooks/useProfileSetup";

const ProfileSetupView = () => {
  const setup = useProfileSetup();

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[760px]">
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
      </Container>
    </main>
  );
};

export default ProfileSetupView;
