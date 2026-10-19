/**
 * API responses are often `{ success, data, meta }` or nested envelopes.
 * Normalize to the inner `data` payload when present.
 */
export function unwrapApiData(payload) {
  if (payload == null) return payload;
  if (typeof payload !== "object") return payload;

  if ("data" in payload && payload.data !== undefined) {
    const inner = payload.data;
    if (inner && typeof inner === "object" && "data" in inner) {
      return inner.data !== undefined ? inner.data : inner;
    }
    return inner;
  }

  return payload;
}

/**
 * Prefer a real user object over auth envelopes that also carry tokens.
 */
export function unwrapUser(payload) {
  const data = unwrapApiData(payload) ?? payload;
  if (!data || typeof data !== "object") return null;

  if (data.user && typeof data.user === "object") return data.user;
  if (data.role || data.email || data.id) return data;

  const nested = unwrapApiData(data);
  if (nested && typeof nested === "object") {
    if (nested.user && typeof nested.user === "object") return nested.user;
    if (nested.role || nested.email || nested.id) return nested;
  }

  return null;
}
