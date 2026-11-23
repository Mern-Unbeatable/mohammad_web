import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import {
  Briefcase,
  Building2,
  Clock,
  Crown,
  MapPin,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { quickLinks } from "@/modules/user/data/dashboard";
import { toProfilePageUser } from "@/features/user/profile";
import { coverGradientClass } from "@/shared/utils/coverGradient";

const iconMap = {
  package: Package,
  briefcase: Briefcase,
  users: Users,
};

const MetaLine = ({ icon, children, className = "" }) => {
  const Icon = icon;
  return (
    <span className={`inline-flex min-w-0 items-center gap-1 ${className}`}>
      <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{children}</span>
    </span>
  );
};

const ProfileCard = ({ user }) => {
  const [failedCover, setFailedCover] = useState(null);

  if (!user) {
    return (
      <Card className="px-4 py-8 text-center text-[13px] text-[#64748B]">
        Loading profile…
      </Card>
    );
  }

  const showCover = Boolean(user.coverPhoto) && failedCover !== user.coverPhoto;

  return (
    <Card className="text-center">
      <Link to="/profile" className="block">
        <div
          className={`h-16 overflow-hidden ${coverGradientClass(user.id || user.name)}`}
        >
          {showCover ? (
            <img
              src={user.coverPhoto}
              alt=""
              onError={() => setFailedCover(user.coverPhoto)}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="-mt-8 px-4 pb-4">
          <Avatar
            src={user.avatar}
            alt={user.name}
            initials={user.initials}
            size="lg"
            className="mx-auto border-4 border-white bg-[#E8F3FB]"
          />
          <h2 className="mt-3 text-[15px] font-bold text-deep-blue transition-colors hover:text-primary">
            {user.name}
          </h2>

          {user.title && (
            <p className="mt-1 text-[13px] text-[#64748B]">{user.title}</p>
          )}

          {user.company || user.location ? (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[12px] text-[#98A2B3]">
              {user.company ? (
                <MetaLine icon={Building2}>{user.company}</MetaLine>
              ) : null}
              {user.location ? (
                <MetaLine icon={MapPin}>{user.location}</MetaLine>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
      <div className="mx-4 mb-4 flex items-center justify-between border-t border-[#E4E7EC] pt-3">
        <p className="inline-flex items-center gap-1.5 text-[12px] text-[#64748B]">
          <Users aria-hidden className="h-4 w-4 text-primary" />
          Connections
        </p>
        <p className="text-[15px] font-bold text-primary">{user.connections}</p>
      </div>
    </Card>
  );
};

const ViewPlansLink = () => (
  <Link
    to="/subscription"
    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
  >
    <Crown aria-hidden className="h-4 w-4" />
    View plans
  </Link>
);

const TrialCard = ({ user }) => {
  if (!user) return null;

  if (user.membershipStatus === "trial") {
    const total = user.trialDaysTotal || 90;
    const left = user.trialDaysLeft ?? 0;
    const progress = Math.min(100, Math.max(0, ((total - left) / total) * 100));

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
            <Sparkles aria-hidden className="h-4 w-4 text-[#B8860B]" />
            Free trial
          </p>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#64748B]">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {left} of {total} days remaining
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${100 - progress}%` }}
          />
        </div>
        <ViewPlansLink />
      </Card>
    );
  }

  if (
    user.membershipStatus === "expired" ||
    user.membershipStatus === "free" ||
    (user.membershipStatus === "cancelled" && !user.isActive)
  ) {
    return (
      <Card className="p-4">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-deep-blue">
          <Crown aria-hidden className="h-4 w-4 text-[#E67E22]" />
          Membership
        </p>
        <p className="mt-1 text-[12px] text-[#64748B]">
          {user.membershipStatus === "expired"
            ? "Your membership has expired."
            : "Upgrade for full Lab Unity access."}
        </p>
        <ViewPlansLink />
      </Card>
    );
  }

  return null;
};

const QuickLinksCard = () => (
  <Card className="p-2">
    {quickLinks.map(({ id, label, icon, to }) => {
      const Icon = iconMap[icon];
      return (
        <Link
          key={id}
          to={to}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </Link>
      );
    })}
  </Card>
);

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = toProfilePageUser(user);

  return (
    <div className="hidden w-[320px] shrink-0 lg:block">
      <div className="sticky top-[70px] space-y-3">
        <ProfileCard user={profileUser} />
        <TrialCard user={profileUser} />
        <QuickLinksCard />
      </div>
    </div>
  );
};

export default LeftSidebar;
