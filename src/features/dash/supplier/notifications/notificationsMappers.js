import { createNotificationListMapper } from "@/features/notifications";

/** Rewrite absolute app links into the supplier panel when needed. */
export function toSupplierLink(link) {
  if (!link) return null;
  if (link.startsWith("/supplier/")) return link;
  if (link === "/chat" || link.startsWith("/chat/") || link.startsWith("/chat?")) {
    return `/supplier${link}`;
  }
  if (link === "/messages" || link.startsWith("/messages?")) {
    return `/supplier${link}`;
  }
  if (link.startsWith("/contacts/")) {
    return `/supplier${link}`;
  }
  if (link.startsWith("/ads/")) {
    return `/supplier${link}`;
  }
  if (link.startsWith("/recruitment/")) {
    return `/supplier${link}`;
  }
  return link;
}

export const toNotificationListModel = createNotificationListMapper(toSupplierLink);
