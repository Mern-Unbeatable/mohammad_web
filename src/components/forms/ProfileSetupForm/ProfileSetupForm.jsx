import { useRef } from 'react';
import { Camera } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

const ImagePickButton = ({ onPick, disabled, className, label, title, children }) => {
  const inputRef = useRef(null);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      aria-label={label}
      title={title}
      className={className}
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
      {children}
    </button>
  );
};

const toInitials = (firstName, lastName) =>
  [firstName, lastName]
    .map((part) => part?.trim()?.[0]?.toUpperCase())
    .filter(Boolean)
    .join('') || 'U';

const ProfileMediaHeader = ({
  values,
  title,
  subtitle,
  onUploadAvatar,
  onUploadCover,
  uploading,
}) => (
  <>
    <div className="relative h-32 overflow-hidden bg-deep-blue sm:h-36">
      {values.coverUrl ? (
        <img
          src={values.coverUrl}
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent" />
      <ImagePickButton
        onPick={onUploadCover}
        disabled={uploading || !onUploadCover}
        title="JPG, PNG or WebP · 1600×600px"
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-deep-blue shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:right-4 sm:top-4"
      >
        <Camera className="h-3.5 w-3.5" />
        {uploading ? 'Uploading…' : values.coverUrl ? 'Change cover' : 'Add cover'}
      </ImagePickButton>
    </div>

    <div className="relative border-b border-[#E4E7EC] px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
        <ImagePickButton
          onPick={onUploadAvatar}
          disabled={uploading || !onUploadAvatar}
          label="Change profile photo"
          title="JPG, PNG or WebP · 400×400px"
          className="group relative -mt-[4.25rem] self-start rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 sm:-mt-[4.75rem]"
        >
          <Avatar
            src={values.avatarUrl || null}
            alt=""
            initials={toInitials(values.firstName, values.lastName)}
            size="xl"
            className="border-[3px] border-white"
          />
          <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-deep-blue/40 opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0">
            <Camera className="h-6 w-6 text-white" />
          </span>
          <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
            <Camera className="h-4 w-4" />
          </span>
        </ImagePickButton>

        <div className="min-w-0 sm:pb-0.5">
          <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">{subtitle}</p>
          <p className="mt-1 text-[12px] text-[#98A2B3]">
            Photo 400×400px · Cover 1600×600px · JPG, PNG or WebP
          </p>
        </div>
      </div>
    </div>
  </>
);

const ProfileSetupForm = ({
  values,
  onChange,
  onSubmit,
  onUploadAvatar,
  onUploadCover,
  uploading = false,
  countries = [],
  submitLabel = 'Save and Start Networking',
  title = 'Set up your professional profile',
  subtitle = 'This is what laboratories, suppliers and recruiters will see.',
  submitDisabled = false,
}) => (
  <Card>
    <ProfileMediaHeader
      values={values}
      title={title}
      subtitle={subtitle}
      onUploadAvatar={onUploadAvatar}
      onUploadCover={onUploadCover}
      uploading={uploading}
    />

    <form onSubmit={onSubmit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={values.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={values.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Job Title / Position
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          className={fieldClass}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Laboratory Name
          </label>
          <input
            id="company"
            type="text"
            value={values.company}
            onChange={(e) => onChange('company', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <select
            id="country"
            value={values.country}
            onChange={(e) => onChange('country', e.target.value)}
            className={fieldClass}
            required
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            readOnly
            className={`${fieldClass} cursor-not-allowed bg-[#F9FAFB] text-[#64748B]`}
            title="Email cannot be changed here"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="about" className={labelClass}>
          Professional information
        </label>
        <textarea
          id="about"
          rows={5}
          value={values.about}
          onChange={(e) => onChange('about', e.target.value)}
          className={`${fieldClass} resize-y`}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitDisabled || uploading}
        className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#066BB0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  </Card>
);

export default ProfileSetupForm;
