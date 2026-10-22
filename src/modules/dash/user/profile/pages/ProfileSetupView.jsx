import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import DashboardPage from "@/components/layout/DashboardPage";
import ProfileSetupForm from "../components/setup/ProfileSetupForm";
import ProfileSetupLoading from "@/components/loader/spinners/ProfileSetupLoading";
import { PROFILE_PATH } from "../constant/constants";
import { useProfileSetup } from "../hooks/useProfileSetup";

const ProfileSetupView = () => {
  const setup = useProfileSetup();

  return (
    <DashboardPage width="narrow" spacing="relaxed">
      <Link
        to={PROFILE_PATH}
        className="inline-flex items-center gap-1.5 self-start rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to profile
      </Link>
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
