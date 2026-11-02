import { AdminAccountFormSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import AdminAccountForm from "../components/form/AdminAccountForm";
import { useAdminProfile } from "../hooks/useAdminProfile";

const AdminProfileView = () => {
  const profile = useAdminProfile();

  if (profile.loading) {
    return (
      <PanelPage>
        <AdminAccountFormSkeleton />
      </PanelPage>
    );
  }

  return (
    <AdminAccountForm
      profileValues={profile.form}
      passwordValues={profile.passwords}
      onProfileChange={profile.changeProfileField}
      onPasswordChange={profile.changePasswordField}
      onUpdateProfile={profile.updateProfile}
      onChangePassword={profile.changePassword}
      onAvatarChange={profile.changeAvatar}
      avatarUploading={profile.uploadingAvatar}
    />
  );
};

export default AdminProfileView;
