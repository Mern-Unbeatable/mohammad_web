import {
  AlertTriangle,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
  UserPlus,
} from "lucide-react";

/** Map API notifications onto the notifications list UI. */

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US");
};

const notificationVisual = (type) => {
  switch (type) {
    case "AD_APPROVED":
    case "CONNECTION_ACCEPTED":
      return {
        icon: CheckCircle2,
        iconClass: "bg-green-secondary text-green-primary",
      };
    case "AD_REJECTED":
    case "AD_EXPIRING":
    case "REPORT_UPDATE":
      return {
        icon: AlertTriangle,
        iconClass: "bg-[#FEF3E8] text-[#E67E22]",
      };
    case "CONNECTION_REQUEST":
      return {
        icon: UserPlus,
        iconClass: "bg-secondary text-primary",
      };
    case "MESSAGE":
    case "GROUP_MESSAGE":
      return {
        icon: MessageSquare,
        iconClass: "bg-pink-secondary text-pink-light",
      };
    case "JOB_MATCH":
    case "JOB_APPLICATION":
      return {
        icon: Briefcase,
        iconClass: "bg-secondary text-primary",
      };
    case "SYSTEM":
      return {
        icon: Bell,
        iconClass: "bg-[#F3F4F6] text-[#64748B]",
      };
    default:
      return {
        icon: Clock,
        iconClass: "bg-secondary text-primary",
      };
  }
};

/**
 * Keep absolute app links in the user panel when needed.
 */
export function toUserLink(link) {
  if (!link) return null;
  if (link.startsWith("/supplier/")) {
    return link.replace(/^\/supplier/, "") || "/";
  }
  return link;
}

export function toNotificationListModel(item) {
  if (!item) return null;
  const visual = notificationVisual(item.type);
  return {
    id: item.id,
    type: item.type,
    icon: visual.icon,
    iconClass: visual.iconClass,
    title: item.title || "Notification",
    subtitle: item.subtitle || "",
    time: formatRelativeTime(item.createdAt),
    link: toUserLink(item.link),
    unread: item.read === false,
    read: Boolean(item.read),
    raw: item,
  };
}
