import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Messaging HTTP helpers shared by User, Supplier and Admin — no Redux.
 */

const E = API_ENDPOINTS.MESSAGES;

const dropEmpty = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

const listOf = (response) => {
  const data = unwrapApiData(response);
  return Array.isArray(data) ? data : [];
};

export async function getConversations(params = {}) {
  const query = dropEmpty({ page: 1, pageSize: 30, ...params });
  const response = await crudService.get(E.LIST, query);
  return {
    data: listOf(response),
    meta: response?.meta || {
      page: query.page,
      pageSize: query.pageSize,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function getConversation(conversationId) {
  return unwrapApiData(await crudService.get(E.DETAILS(conversationId)));
}

/** The caller's existing 1:1 conversation with `userId`, or null. */
export async function getDirectConversation(userId) {
  return unwrapApiData(await crudService.get(E.DIRECT_WITH(userId))) ?? null;
}

export async function getThread(conversationId, params = {}) {
  const query = dropEmpty({ pageSize: 30, ...params });
  const response = await crudService.get(E.THREAD(conversationId), query);
  return {
    data: listOf(response),
    hasMore: Boolean(response?.meta?.hasMore),
  };
}

export async function markRead(conversationId) {
  return unwrapApiData(await crudService.post(E.READ(conversationId)));
}

export async function getUnreadSummary() {
  const data = unwrapApiData(await crudService.get(E.UNREAD));
  return {
    messages: Number(data?.messages) || 0,
    conversations: Number(data?.conversations) || 0,
  };
}

export async function getRecipients(params = {}) {
  const response = await crudService.get(E.RECIPIENTS, dropEmpty(params));
  return listOf(response);
}

/** `{ participantId, message, listingId? }` */
export async function startDirect(payload) {
  return unwrapApiData(await crudService.post(E.DIRECT, dropEmpty(payload)));
}

export async function createGroup(payload) {
  return unwrapApiData(await crudService.post(E.GROUP, payload));
}

export async function sendMessage(
  conversationId,
  { body = "", attachments = [], listingId },
) {
  return unwrapApiData(
    await crudService.post(
      E.SEND(conversationId),
      dropEmpty({ body, attachments, listingId }),
    ),
  );
}

export async function deleteMessage(conversationId, messageId) {
  await crudService.del(E.DELETE_MESSAGE(conversationId, messageId));
  return { conversationId, messageId };
}

export async function leaveConversation(conversationId) {
  await crudService.del(E.LEAVE(conversationId));
  return { conversationId };
}

export async function renameGroup(conversationId, name) {
  return unwrapApiData(await crudService.patch(E.RENAME(conversationId), { name }));
}

export async function addParticipants(conversationId, participantIds) {
  return unwrapApiData(
    await crudService.post(E.PARTICIPANTS(conversationId), { participantIds }),
  );
}

export async function removeParticipant(conversationId, userId) {
  return unwrapApiData(
    await crudService.del(E.PARTICIPANT(conversationId, userId)),
  );
}

/** Uploads one file and returns the attachment shape the messages API expects. */
export async function uploadAttachment(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const uploaded = unwrapApiData(
    await crudService.upload(E.UPLOAD, formData, onProgress),
  );
  return {
    url: uploaded.url,
    name: uploaded.originalName || file.name,
    mimeType: uploaded.mimeType || file.type,
    size: uploaded.size ?? file.size,
  };
}

export { getApiErrorMessage };
