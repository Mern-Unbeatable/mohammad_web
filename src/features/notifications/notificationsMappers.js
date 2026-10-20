import {
  AlertTriangle,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { formatRelativeTime } from "@/shared/utils/dates/date";

/** Map API notifications onto the notifications list UI. */

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

/** List-model mapper for one role; `toRoleLink` rewrites links into that role's panel. */
export function createNotificationListMapper(toRoleLink) {
  return function toNotificationListModel(item) {
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
      link: toRoleLink(item.link),
      unread: item.read === false,
      read: Boolean(item.read),
      raw: item,
    };
  };
}
