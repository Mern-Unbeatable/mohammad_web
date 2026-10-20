import { Camera, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import PanelPage from '@/components/navigation/panel/PanelPage';
import PanelPageHeader from '@/components/navigation/panel/PanelPageHeader';
import { panelPrimaryBtn } from '@/components/navigation/panel/panelPageTheme';
import { FormLabel, Input, PasswordInput } from '@/components/form-controls';

const PasswordField = ({ id, label, value, onChange }) => (
  <div>
    <FormLabel htmlFor={id}>
      {label}
    </FormLabel>
    <PasswordInput id={id} value={value} onChange={onChange} />
  </div>
);

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

const AvatarPicker = ({ src, initials, alt, onPick, uploading }) => {
  const inputRef = useRef(null);
  const disabled = uploading || !onPick;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      aria-label="Change profile photo"
      title="JPG, PNG or WebP · 400×400px"
      className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed"
    >
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onPick?.(file);
        }}
      />
      <Avatar src={src || null} alt={alt} initials={initials || 'AD'} size="lg" />
      {uploading ? (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-deep-blue/50">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </span>
      ) : onPick ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-deep-blue/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
            <Camera className="h-3 w-3" />
          </span>
        </>
      ) : null}
    </button>
  );
};

const AdminAccountForm = ({
  profileValues,
  passwordValues,
  onProfileChange,
  onPasswordChange,
  onUpdateProfile,
  onChangePassword,
  onAvatarChange,
  avatarUploading = false,
  title = 'My Profile',
  subtitle = 'Manage your account and store preferences.',
}) => (
  <PanelPage>
    <PanelPageHeader title={title} subtitle={subtitle} />

    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4 border-b border-[#E4E7EC] pb-4">
        <AvatarPicker
          src={profileValues.avatar}
          initials={profileValues.initials}
          alt={profileValues.displayName}
          onPick={onAvatarChange}
          uploading={avatarUploading}
        />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold text-deep-blue">{profileValues.displayName}</p>
          <p className="truncate text-[13px] text-[#64748B]">{profileValues.displayEmail}</p>
          {onAvatarChange ? (
            <p className="mt-0.5 text-[12px] text-[#98A2B3]">
              {avatarUploading ? 'Uploading photo…' : 'Click the photo to change it · JPG, PNG or WebP'}
            </p>
          ) : null}
        </div>
      </div>

      <section className="mt-5">
        <h2 className="text-[16px] font-bold text-deep-blue">Account Information</h2>
        <form
          onSubmit={onUpdateProfile}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <FormLabel htmlFor="admin-name">
              Name
            </FormLabel>
            <Input
              id="admin-name"
              type="text"
              value={profileValues.name}
              onChange={(e) => onProfileChange('name', e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor="admin-email">
              Email
            </FormLabel>
            <Input
              id="admin-email"
              type="email"
              value={profileValues.email}
              onChange={(e) => onProfileChange('email', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className={panelPrimaryBtn}>
              Update Profile
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 border-t border-[#E4E7EC] pt-5">
        <h2 className="text-[16px] font-bold text-deep-blue">Change Password</h2>
        <form
          onSubmit={onChangePassword}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <PasswordField
            id="current-password"
            label="Current Password"
            value={passwordValues.current}
            onChange={(e) => onPasswordChange('current', e.target.value)}
          />
          <PasswordField
            id="new-password"
            label="New Password"
            value={passwordValues.next}
            onChange={(e) => onPasswordChange('next', e.target.value)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={passwordValues.confirm}
            onChange={(e) => onPasswordChange('confirm', e.target.value)}
          />
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" className={panelPrimaryBtn}>
              Change Password
            </button>
          </div>
        </form>
      </section>
    </Card>
  </PanelPage>
);

export default AdminAccountForm;
