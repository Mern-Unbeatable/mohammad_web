import { crudService, unwrapApiData } from "@/config";

/**
 * Notifications HTTP helpers — no Redux. Shared by every role;
 * `endpoints` is the role's `API_ENDPOINTS.<ROLE>.NOTIFICATIONS` group.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
    total: 0,
    totalPages: 1,
    unreadCount: 0,
  };

  if (Array.isArray(inner)) {
    rows = inner;
    metaData = { ...metaData, ...(outer?.meta || {}) };
  } else if (Array.isArray(inner?.data)) {
    rows = inner.data;
    metaData = { ...metaData, ...(inner.meta || outer?.meta || {}) };
  } else if (Array.isArray(outer?.data)) {
    rows = outer.data;
    metaData = { ...metaData, ...(outer.meta || {}) };
  }

  if (!metaData.total && rows.length) {
    metaData = {
      ...metaData,
      total: rows.length,
      totalPages: Math.max(
        1,
        Math.ceil(rows.length / (metaData.pageSize || 20)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

export function createNotificationsApi(endpoints) {
  async function getNotifications(params = {}) {
    const query = {
      page: 1,
      pageSize: 20,
      sort: "desc",
      ...params,
    };
    if (query.unread === undefined || query.unread === null) {
      delete query.unread;
    }

    const response = await crudService.get(endpoints.LIST, query);
    return parseListResponse(response, query);
  }

  /** Account-wide unread total (`meta.unreadCount` is independent of paging/filters). */
  async function getUnreadCount() {
    const { meta } = await getNotifications({ page: 1, pageSize: 1 });
    return Number(meta?.unreadCount) || 0;
  }

  async function markNotificationRead(notificationId) {
    const response = await crudService.patch(endpoints.READ(notificationId));
    return unwrapApiData(response) || { id: notificationId, read: true };
  }

  async function markAllNotificationsRead() {
    const response = await crudService.patch(endpoints.READ_ALL);
    return unwrapApiData(response) ?? { ok: true };
  }

  async function deleteNotification(notificationId) {
    const response = await crudService.del(endpoints.DELETE(notificationId));
    return {
      notificationId,
      data: unwrapApiData(response) ?? response,
    };
  }

  return {
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  };
}
