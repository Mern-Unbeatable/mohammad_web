import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin chat moderation HTTP helpers — no Redux. Used by adminMessagesThunks.
 */

const E = API_ENDPOINTS.ADMIN.MESSAGES;

export async function getConversations(params = {}) {
  const query = Object.fromEntries(
    Object.entries({ page: 1, pageSize: 20, ...params }).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
  const response = await crudService.get(E.LIST, query);
  const data = unwrapApiData(response);
  return {
    data: Array.isArray(data) ? data : [],
    meta: response?.meta || { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  };
}

export async function getConversation(conversationId) {
  return unwrapApiData(await crudService.get(E.DETAILS(conversationId)));
}

export async function getThread(conversationId, params = {}) {
  const response = await crudService.get(E.THREAD(conversationId), {
    pageSize: 50,
    ...params,
  });
  const data = unwrapApiData(response);
  return {
    data: Array.isArray(data) ? data : [],
    hasMore: Boolean(response?.meta?.hasMore),
  };
}

export async function deleteMessage(conversationId, messageId) {
  await crudService.del(E.DELETE_MESSAGE(conversationId, messageId));
  return { conversationId, messageId };
}

export async function deleteConversation(conversationId) {
  await crudService.del(E.DELETE(conversationId));
  return { conversationId };
}

export { getApiErrorMessage };
