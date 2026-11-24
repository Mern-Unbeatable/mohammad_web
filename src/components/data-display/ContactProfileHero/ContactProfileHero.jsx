import { useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import Card from "@/components/ui/Card";
import PresenceDot from "@/components/ui/PresenceDot";
import ZoomableAvatar from "@/components/data-display/ZoomableAvatar/ZoomableAvatar";
import { MetaItem } from "@/components/data-display/ProfileHero/ProfileHero";
import { useUserPresence } from "@/features/messages/useUserPresence";
import { coverGradientClass } from "@/shared/utils/gradient/coverGradient";

/** The contact model fills missing fields with "—"; those rows are hidden. */
const isShown = (value) =>
  typeof value === "string" && value.trim() !== "" && value.trim() !== "—";

const ContactProfileHero = ({
  contact,
  connected = false,
  pending = false,
  onConnect,
  onMessage,
  messageHref,
  coverPhoto,
  showConnect = true,
}) => {
  const [failedCover, setFailedCover] = useState(null);
  const cover = coverPhoto || contact.coverPhoto;
  const showCover = Boolean(cover) && failedCover !== cover;
  const connections = Number(contact.connections) || 0;
  const { getStatus } = useUserPresence(contact?.id ? [contact.id] : []);
  const presence = getStatus(contact?.id);
  const isOnline = presence === "online";
  const showStatus = ["online", "offline", "loading"].includes(presence);

  return (
    <Card>
      <div
        className={`relative h-32 overflow-hidden sm:h-36 ${coverGradientClass(contact.id || contact.name)}`}
      >
        {showCover ? (
          <img
            src={cover}
            alt=""
            onError={() => setFailedCover(cover)}
            className="h-full w-full object-cover opacity-90"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent" />
      </div>

      <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
            <ZoomableAvatar
              src={contact.avatar}
              alt={contact.name}
              initials={contact.initials}
              size="xl"
              className="-mt-[4rem] shrink-0 sm:-mt-[3rem]"
              avatarClassName={`border-[3px] border-white shadow-sm ${contact.avatarClass || ""}`}
            />

            <div className="w-full min-w-0 sm:w-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="break-words text-[22px] font-bold leading-tight tracking-tight text-deep-blue sm:text-[28px]">
                  {contact.name}
                </h1>
                {showStatus ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-[#F9FAFB] px-2.5 py-1 text-[11px] font-semibold text-[#475467]">
                    <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
                      <PresenceDot online={isOnline} />
                    </span>
                    {presence === "online"
                      ? "Online"
                      : presence === "loading"
                        ? "Checking status"
                        : "Offline"}
                  </span>
                ) : null}
              </div>

              {isShown(contact.title) ? (
                <p className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-[14px] font-medium text-[#475467] sm:text-[15px]">
                  <Briefcase
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2}
                  />
                  {contact.title}
                </p>
              ) : null}

              <ul className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[13px] text-[#64748B] sm:justify-start sm:gap-x-5">
                {isShown(contact.company) ? (
                  <MetaItem icon={Building2}>{contact.company}</MetaItem>
                ) : null}
                {isShown(contact.country) ? (
                  <MetaItem icon={MapPin}>{contact.country}</MetaItem>
                ) : null}
                <MetaItem icon={Users}>
                  <span className="font-semibold text-deep-blue">
                    {connections.toLocaleString()}
                  </span>{" "}
                  {connections === 1 ? "connection" : "connections"}
                </MetaItem>
              </ul>
            </div>
          </div>

          <div className="flex w-full shrink-0 gap-2 sm:w-auto lg:pt-1">
            {showConnect ? (
              <button
                type="button"
                onClick={onConnect}
                disabled={connected || pending}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-semibold transition-colors sm:flex-none ${
                  connected || pending
                    ? "bg-green-secondary text-green-primary"
                    : "bg-primary text-white hover:bg-[#066BB0]"
                }`}
              >
                {connected ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Connected
                  </>
                ) : pending ? (
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
            ) : null}
            {messageHref && !onMessage ? (
              <Link
                to={messageHref}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-green-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-green-primary transition-colors hover:bg-green-secondary sm:flex-none"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Link>
            ) : (
              <button
                type="button"
                onClick={onMessage}
                aria-haspopup={onMessage ? "dialog" : undefined}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-green-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-green-primary transition-colors hover:bg-green-secondary sm:flex-none"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactProfileHero;
