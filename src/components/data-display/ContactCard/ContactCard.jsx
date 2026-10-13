import { useState } from "react";
import { Link } from "react-router";
import {
  Briefcase,
  Building2,
  Check,
  Clock,
  MapPin,
  UserPlus,
  UserRound,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const InfoLine = ({ icon, value, className = "" }) => {
  const Icon = icon;
  if (!value || value === "—") return null;
  return (
    <li
      className={`inline-flex max-w-full items-center gap-1.5 text-[13px] ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#98A2B3]" />
      <span className="truncate">{value}</span>
    </li>
  );
};

const ContactCard = ({
  contact,
  profileBasePath = "/contacts",
  connected = false,
  pending = false,
  incoming = false,
  accepting = false,
  onConnect,
  onAccept,
}) => {
  const [failedCover, setFailedCover] = useState(null);
  const showConfirm = Boolean(incoming && pending && !connected);
  const showCover =
    Boolean(contact.coverPhoto) && failedCover !== contact.coverPhoto;

  return (
    <Card className="flex flex-col text-center">
      <div className="relative h-16 overflow-hidden bg-slate-100">
        {showCover ? (
          <img
            src={contact.coverPhoto}
            alt=""
            loading="lazy"
            onError={() => setFailedCover(contact.coverPhoto)}
            className="h-full w-full object-cover opacity-90"
          />
        ) : null}
        <div className="absolute inset-0 " />
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pb-5">
        <Avatar
          src={contact.avatar}
          alt={contact.name}
          initials={contact.initials}
          size="lg"
          className={`relative -mt-10 h-20! w-20! border-4 border-white text-[24px]! shadow-sm ${contact.avatarClass || ""}`}
        />
        <Link
          to={`${profileBasePath}/${contact.id}`}
          className="mt-3 text-[15px] font-semibold text-primary hover:underline"
        >
          {contact.name}
        </Link>
        <ul className="mt-1 flex w-full flex-col items-center gap-1">
          <InfoLine icon={Briefcase} value={contact.title} className="text-[#475467]" />
          <InfoLine
            icon={Building2}
            value={contact.company}
            className="font-semibold text-deep-blue"
          />
          <InfoLine icon={MapPin} value={contact.country} className="text-[#64748B]" />
        </ul>

        <div
          className={`mt-auto grid w-full gap-2 pt-4 ${connected ? "grid-cols-1" : "grid-cols-2"}`}
        >
          <Link
            to={`${profileBasePath}/${contact.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-[13px] hover:bg-sky-100 font-semibold text-primary transition-opacity hover:opacity-90"
          >
            <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
            View Profile
          </Link>
          {connected ? null : showConfirm ? (
            <button
              type="button"
              onClick={() => onAccept?.(contact.connectionId, contact.id)}
              disabled={accepting || !contact.connectionId}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-primary px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              {accepting ? "Confirming…" : "Confirm"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConnect?.(contact.id)}
              disabled={pending}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                pending
                  ? "bg-green-secondary text-green-primary"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {pending ? (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  Pending
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  Connect
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
