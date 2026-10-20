import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { crudService, tokenService, API_ENDPOINTS } from "@/config";

const REALTIME_EVENTS = [
  "message:new",
  "message:updated",
  "message:deleted",
  "conversation:new",
  "conversation:updated",
  "conversation:removed",
  "conversation:read",
  "presence:update",
  "typing",
  "notification:new",
  "notification:updated",
];

const MAX_AUTH_RETRIES = 3;
/** Keeps the socket through quick unmount/remount cycles (StrictMode, route changes). */
const RELEASE_GRACE_MS = 1000;

/** Socket server origin; defaults to the API origin without `/api/v1`. */
export function resolveSocketUrl(env = import.meta.env) {
  if (env.VITE_SOCKET_URL) return env.VITE_SOCKET_URL;
  const api = env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
  try {
    return new URL(api).origin;
  } catch {
    return "http://localhost:4000";
  }
}

let socket = null;
let holders = 0;
let authRetries = 0;
let releaseTimer = null;

function createSocket() {
  const instance = io(resolveSocketUrl(), {
    // Called on every (re)connect so a refreshed access token is picked up.
    auth: (cb) => cb({ token: tokenService.getToken() }),
    transports: ["websocket", "polling"],
    reconnectionDelayMax: 10000,
  });

  /** An authenticated HTTP call lets the axios interceptor refresh the token, then reconnect. */
  const reconnectWithFreshToken = async () => {
    try {
      await crudService.get(API_ENDPOINTS.AUTH.ME);
    } catch {
      return;
    }
    if (socket === instance && !instance.connected) instance.connect();
  };

  let sessionExpired = false;

  instance.on("connect", () => {
    authRetries = 0;
    sessionExpired = false;
  });

  // Middleware rejections are not retried by socket.io.
  instance.on("connect_error", (error) => {
    if (error?.message !== "UNAUTHENTICATED" || authRetries >= MAX_AUTH_RETRIES) {
      return;
    }
    authRetries += 1;
    reconnectWithFreshToken();
  });

  // The server ends sockets whose access token expired ("session:expired")
  // or whose account was suspended ("session:revoked"). socket.io does not
  // reconnect after a server-side disconnect, so only expiry resumes.
  instance.on("session:expired", () => {
    sessionExpired = true;
  });
  instance.on("disconnect", (reason) => {
    if (reason !== "io server disconnect" || !sessionExpired) return;
    sessionExpired = false;
    reconnectWithFreshToken();
  });

  return instance;
}

export function acquireSocket() {
  if (releaseTimer) {
    clearTimeout(releaseTimer);
    releaseTimer = null;
  }
  if (!socket) socket = createSocket();
  holders += 1;
  return socket;
}

export function releaseSocket() {
  holders = Math.max(0, holders - 1);
  if (holders > 0 || !socket || releaseTimer) return;
  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    if (holders === 0 && socket) {
      socket.disconnect();
      socket = null;
    }
  }, RELEASE_GRACE_MS);
}

/**
 * Subscribes to messaging events for the lifetime of the component.
 * `handlers` maps event names (plus `connect`) to callbacks; the latest
 * handlers are always used without re-subscribing.
 */
export function useMessagesSocket(handlers) {
  const handlersRef = useRef(handlers);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const instance = acquireSocket();

    const listeners = REALTIME_EVENTS.map((event) => [
      event,
      (payload) => handlersRef.current?.[event]?.(payload),
    ]);
    listeners.forEach(([event, fn]) => instance.on(event, fn));

    const onConnect = () => {
      setConnected(true);
      handlersRef.current?.connect?.(instance);
    };
    const onDisconnect = () => setConnected(false);
    instance.on("connect", onConnect);
    instance.on("disconnect", onDisconnect);

    // Already connected (another component holds the socket): sync on next tick.
    const syncTimer = instance.connected ? setTimeout(onConnect, 0) : null;

    return () => {
      if (syncTimer) clearTimeout(syncTimer);
      listeners.forEach(([event, fn]) => instance.off(event, fn));
      instance.off("connect", onConnect);
      instance.off("disconnect", onDisconnect);
      releaseSocket();
    };
  }, []);

  return { connected };
}

/** Re-sends "typing" at most this often while the user keeps typing. */
const TYPING_THROTTLE_MS = 3000;
/** Sends "stopped" after this long without a keystroke. */
const TYPING_IDLE_MS = 4000;

/**
 * Tells the other participants of `conversationId` that the user is typing.
 * Returns `{ notify, stop }`: call `notify` on every keystroke and `stop`
 * after sending or leaving the conversation.
 */
export function useTypingEmitter(socketRef, conversationId) {
  const stateRef = useRef({ lastSent: 0, idleTimer: null, active: false });

  const send = (typing) => {
    const instance = socketRef.current;
    if (!conversationId || !instance?.connected) return;
    instance.emit("typing", { conversationId, typing });
  };

  const stop = () => {
    const state = stateRef.current;
    if (state.idleTimer) clearTimeout(state.idleTimer);
    state.idleTimer = null;
    if (state.active) send(false);
    state.active = false;
    state.lastSent = 0;
  };

  const notify = () => {
    const state = stateRef.current;
    const now = Date.now();
    if (!state.active || now - state.lastSent >= TYPING_THROTTLE_MS) {
      send(true);
      state.active = true;
      state.lastSent = now;
    }
    if (state.idleTimer) clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(stop, TYPING_IDLE_MS);
  };

  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  });
  useEffect(() => () => stopRef.current(), [conversationId]);

  return { notify, stop };
}

/** Asks the server which of `userIds` are online (limited to conversation partners). */
export function queryPresence(instance, userIds) {
  return new Promise((resolve) => {
    if (!instance?.connected || userIds.length === 0) {
      resolve([]);
      return;
    }
    instance.timeout(5000).emit("presence:query", userIds, (err, online) => {
      resolve(err || !Array.isArray(online) ? [] : online);
    });
  });
}
