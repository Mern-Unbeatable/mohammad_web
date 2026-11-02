import { createNotificationListMapper } from "@/features/notifications";

/** Keep absolute app links in the user panel when needed. */
export function toUserLink(link) {
  if (!link) return null;
  if (link.startsWith("/supplier/")) {
    return link.replace(/^\/supplier/, "") || "/";
  }
  return link;
}

export const toNotificationListModel = createNotificationListMapper(toUserLink);
