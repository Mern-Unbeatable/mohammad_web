import AvatarPicker from "./AvatarPicker";

/** Avatar picker with the display name, email and upload hint. */
const ProfileSummary = ({ values, onAvatarChange, uploading }) => (
  <div className="flex items-center gap-4 border-b border-[#E4E7EC] pb-4">
    <AvatarPicker
      src={values.avatar}
      initials={values.initials}
      alt={values.displayName}
      onPick={onAvatarChange}
      uploading={uploading}
    />
    <div className="min-w-0">
      <p className="truncate text-[16px] font-bold text-deep-blue">{values.displayName}</p>
      <p className="truncate text-[13px] text-[#64748B]">{values.displayEmail}</p>
      {onAvatarChange ? (
        <p className="mt-0.5 text-[12px] text-[#98A2B3]">
          {uploading ? "Uploading photo…" : "Click the photo to change it · JPG, PNG or WebP"}
        </p>
      ) : null}
    </div>
  </div>
);

export default ProfileSummary;
