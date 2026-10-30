import { crudService, API_ENDPOINTS, unwrapApiData } from "@/config";

const E = API_ENDPOINTS.MESSAGES;

/** Fetches WebRTC ICE servers (STUN/TURN) configured server-side. */
export async function getIceServers() {
  const response = await crudService.get(E.ICE_SERVERS);
  const data = unwrapApiData(response);
  return Array.isArray(data?.iceServers) ? data.iceServers : [];
}

/** Voice-call history for a conversation (most recent first). */
export async function getCallHistory(conversationId, params = {}) {
  const query = { page: 1, pageSize: 20, ...params };
  const response = await crudService.get(E.CALLS(conversationId), query);
  const data = unwrapApiData(response);
  return {
    data: Array.isArray(data) ? data : [],
    meta: response?.meta || { page: query.page, pageSize: query.pageSize, total: 0 },
  };
}
