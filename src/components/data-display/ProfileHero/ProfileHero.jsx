import { useState } from 'react';
import { Link } from 'react-router';
import {
  Briefcase,
  Building2,
  Crown,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react';
import ZoomableAvatar from '@/components/data-display/ZoomableAvatar/ZoomableAvatar';
import Card from '@/components/ui/Card';
import { currentUser } from '@/modules/user/data/dashboard';
import { coverGradientClass } from '@/shared/utils/coverGradient';

export const InfoTile = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 transition-colors hover:border-[#D0D5DD]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="text-[12px] font-medium leading-none text-[#64748B]">{label}</p>
      <p className="mt-2 break-words text-[14px] font-semibold leading-snug text-deep-blue">{value}</p>
    </div>
  );
};

const hasText = (value) => typeof value === 'string' && value.trim() !== '';

export const MetaItem = ({ icon, children }) => {
  const Icon = icon;
  return (
    <li className="inline-flex min-w-0 items-center gap-1.5">
      <Icon aria-hidden className="h-4 w-4 shrink-0 text-[#98A2B3]" strokeWidth={2} />
      <span className="truncate">{children}</span>
    </li>
  );
};

const MembershipBadge = ({ status }) => {
  const isPremium = status === 'premium';
  const Icon = isPremium ? Crown : Sparkles;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isPremium ? 'bg-[#FEF3E8] text-[#E67E22]' : 'bg-[#FEF9E6] text-[#B8860B]'
      }`}
    >
      <Icon aria-hidden className="h-3.5 w-3.5" strokeWidth={2.25} />
      {isPremium ? 'Premium Member' : 'Free trial member'}
    </span>
  );
};

const ProfileHero = ({
  user = currentUser,
  editHref = '/profile/edit',
  messageHref,
  showMessage = false,
  showEdit = true,
}) => {
  const [failedCover, setFailedCover] = useState(null);
  const showCover = hasText(user.coverPhoto) && failedCover !== user.coverPhoto;
  const location = hasText(user.location) ? user.location : user.country;
  const connections = Number(user.connections) || 0;

  return (
    <Card>
      <div
        className={`relative h-32 overflow-hidden sm:h-36 ${coverGradientClass(user.id || user.name)}`}
      >
        {showCover ? (
          <img
            src={user.coverPhoto}
            alt=""
            onError={() => setFailedCover(user.coverPhoto)}
            className="h-full w-full object-cover opacity-90"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent" />
      </div>

      <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <ZoomableAvatar
              src={user.avatar}
              alt={user.name}
              initials={user.initials}
              size="xl"
              className="-mt-[4.25rem] shrink-0 self-start sm:-mt-[4.75rem]"
              avatarClassName="border-[3px] border-white shadow-sm"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h1 className="text-[24px] font-bold leading-tight tracking-tight text-deep-blue sm:text-[28px]">
                  {user.name}
                </h1>
                {user.membershipStatus ? (
                  <MembershipBadge status={user.membershipStatus} />
                ) : null}
              </div>

              {hasText(user.title) ? (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#475467]">
                  <Briefcase aria-hidden className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                  {user.title}
                </p>
              ) : null}

              <ul className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[#64748B]">
                {hasText(user.company) ? (
                  <MetaItem icon={Building2}>{user.company}</MetaItem>
                ) : null}
                {hasText(location) ? <MetaItem icon={MapPin}>{location}</MetaItem> : null}
                <MetaItem icon={Users}>
                  <span className="font-semibold text-deep-blue">
                    {connections.toLocaleString()}
                  </span>{' '}
                  {connections === 1 ? 'connection' : 'connections'}
                </MetaItem>
              </ul>
            </div>
          </div>

          <div className="flex gap-2 lg:mt-1">
            {showMessage && messageHref ? (
              <Link
                to={messageHref}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-primary px-3.5 py-2 text-[12px] font-semibold text-primary hover:bg-secondary sm:flex-none"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Link>
            ) : null}
            {showEdit && editHref ? (
              <Link
                to={editHref}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#066BB0] sm:w-auto"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit profile
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ProfessionalInfoCard = ({ user = currentUser, extended = false }) => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <h2 className="text-[16px] font-bold text-deep-blue">Professional information</h2>
    </div>
    <div className="space-y-4 px-5 py-5 sm:px-6">
      <p className="text-[14px] leading-[1.7] text-[#475467]">{user.about}</p>
      {extended && user.aboutExtended ? (
        <p className="text-[14px] leading-[1.7] text-[#475467]">{user.aboutExtended}</p>
      ) : null}
    </div>
  </Card>
);

/** `narrow` keeps one tile per row from xl up, for side columns. */
export const ContactInfoCard = ({
  user = currentUser,
  showProfessional = false,
  narrow = false,
  accent = false,
}) => (
  <Card className="h-full overflow-hidden">
    <div
      className={`border-b px-5 py-4 sm:px-6 ${accent ? "border-primary bg-primary" : "border-[#E4E7EC]"}`}
    >
      <h2 className={`text-[16px] font-bold ${accent ? "text-white" : "text-deep-blue"}`}>
        Contact information
      </h2>
    </div>
    <div className="p-4 sm:p-5">
      <div
        className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${narrow ? "xl:grid-cols-1" : ""}`}
      >
        <InfoTile icon={Building2} label="Laboratory / Company" value={user.company} />
        <InfoTile icon={MapPin} label="Country" value={user.country} />
        <InfoTile icon={Mail} label="Email" value={user.email} />
        <InfoTile icon={Phone} label="Phone" value={user.phone} />
      </div>

      {showProfessional ? (
        <div className="mt-5 border-t border-[#E4E7EC] pt-5">
          <h3 className="mb-3 text-[14px] font-bold text-deep-blue">Professional information</h3>
          <div className="space-y-4">
            <p className="text-[14px] leading-[1.7] text-[#475467]">{user.about}</p>
            {user.aboutExtended ? (
              <p className="text-[14px] leading-[1.7] text-[#475467]">{user.aboutExtended}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  </Card>
);

export default ProfileHero;
