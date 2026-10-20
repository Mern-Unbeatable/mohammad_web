import { useState } from "react";
import { Link } from "react-router";
import { Building2, MapPin, Users } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { coverGradientClass } from "@/shared/utils/gradient/coverGradient";
import { PROFILE_PATH } from "../../constant/constants";
import MetaLine from "./MetaLine";

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
      <Link to={PROFILE_PATH} className="block">
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

export default ProfileCard;
