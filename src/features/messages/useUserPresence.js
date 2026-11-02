import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { queryPresence, useMessagesSocket } from "./realtime";

const normalizeUserIds = (ids = []) =>
  Array.from(
    new Set(ids.filter((id) => typeof id === "string" && id)),
  ).sort();

/**
 * Realtime user presence for a list of user ids.
 * Uses the same messaging socket and `presence:query` source as chat.
 */
export function useUserPresence(userIds = []) {
  const ids = useMemo(() => normalizeUserIds(userIds), [userIds]);
  const idsKey = ids.join(",");
  const trackedIds = useMemo(() => new Set(ids), [ids]);
  const trackedIdsRef = useRef(trackedIds);
  const socketRef = useRef(null);
  const requestIdRef = useRef(0);
  const [knownStatusByUserId, setKnownStatusByUserId] = useState({});

  useEffect(() => {
    trackedIdsRef.current = trackedIds;
  }, [trackedIds]);

  const refresh = useCallback(
    async (instance) => {
      if (!instance?.connected || ids.length === 0) return;
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const onlineIds = await queryPresence(instance, ids);
      if (requestId !== requestIdRef.current) return;
      const online = new Set(onlineIds);
      setKnownStatusByUserId((current) => {
        const next = { ...current };
        ids.forEach((id) => {
          if (online.has(id)) {
            next[id] = "online";
            return;
          }
          next[id] = current[id] === "online" || current[id] === "offline" ? "offline" : "unknown";
        });
        return next;
      });
    },
    [ids],
  );

  const { connected } = useMessagesSocket({
    connect: (instance) => {
      socketRef.current = instance;
    },
    "presence:update": (payload) => {
      const userId = payload?.userId;
      if (!trackedIdsRef.current.has(userId)) return;
      setKnownStatusByUserId((current) => ({
        ...current,
        [userId]: payload?.online ? "online" : "offline",
      }));
    },
  });

  useEffect(() => {
    if (!connected || ids.length === 0) return;
    refresh(socketRef.current);
  }, [connected, idsKey, ids.length, refresh]);

  const statusByUserId = useMemo(() => {
    const next = {};
    ids.forEach((id) => {
      next[id] = knownStatusByUserId[id] || (connected ? "loading" : "unknown");
    });
    return next;
  }, [connected, ids, knownStatusByUserId]);

  const getStatus = useCallback(
    (userId) => (userId ? statusByUserId[userId] || "unknown" : "unknown"),
    [statusByUserId],
  );

  return { getStatus, statusByUserId };
}
