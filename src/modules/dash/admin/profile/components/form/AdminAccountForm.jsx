import Card from "@/components/ui/Card";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import ProfileSummary from "./ProfileSummary";
import AccountInfoSection from "./AccountInfoSection";
import PasswordSection from "./PasswordSection";

/** Header plus one card with the avatar summary, account form and password form. */
const AdminAccountForm = ({
  profileValues,
  passwordValues,
  onProfileChange,
  onPasswordChange,
  onUpdateProfile,
  onChangePassword,
  onAvatarChange,
  avatarUploading = false,
  title = "My Profile",
  subtitle = "Manage your account and store preferences.",
}) => (
  <PanelPage>
    <PanelPageHeader title={title} subtitle={subtitle} />

    <Card className="p-5 sm:p-6">
      <ProfileSummary
        values={profileValues}
        onAvatarChange={onAvatarChange}
        uploading={avatarUploading}
      />
      <AccountInfoSection
        values={profileValues}
        onChange={onProfileChange}
        onSubmit={onUpdateProfile}
      />
      <PasswordSection
        values={passwordValues}
        onChange={onPasswordChange}
        onSubmit={onChangePassword}
      />
    </Card>
  </PanelPage>
);

export default AdminAccountForm;
