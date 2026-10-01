import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * User notifications HTTP helpers — no Redux. Used by notificationsThunks.
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

export async function getNotifications(params = {}) {
  const query = {
    page: 1,
    pageSize: 20,
    sort: "desc",
    ...params,
  };
  if (query.unread === undefined || query.unread === null) {
    delete query.unread;
  }

  const response = await crudService.get(
    API_ENDPOINTS.USER.NOTIFICATIONS.LIST,
    query,
  );
  return parseListResponse(response, query);
}

/** Account-wide unread total (`meta.unreadCount` is independent of paging/filters). */
export async function getUnreadCount() {
  const { meta } = await getNotifications({ page: 1, pageSize: 1 });
  return Number(meta?.unreadCount) || 0;
}

export async function markNotificationRead(notificationId) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.NOTIFICATIONS.READ(notificationId),
  );
  return unwrapApiData(response) || { id: notificationId, read: true };
}

export async function markAllNotificationsRead() {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.NOTIFICATIONS.READ_ALL,
  );
  return unwrapApiData(response) ?? { ok: true };
}

export async function deleteNotification(notificationId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.NOTIFICATIONS.DELETE(notificationId),
  );
  return {
    notificationId,
    data: unwrapApiData(response) ?? response,
  };
}

export { getApiErrorMessage };
