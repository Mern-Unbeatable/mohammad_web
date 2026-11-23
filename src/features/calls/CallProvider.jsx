import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { acquireSocket, releaseSocket } from "@/features/messages/realtime";
import CallOverlay from "@/components/calls/CallOverlay";
import { CallContext } from "./callContext";
import { getIceServers } from "./callsApi";
import { useCallRingtone } from "./useCallRingtone";
import {
  CALL_PHASE,
  CALL_RING_TIMEOUT_MS,
  FALLBACK_ICE_SERVERS,
  ackErrorMessage,
  ackErrorReason,
} from "./callConfig";

const ENDED_OVERLAY_MS = 2500;

/**
 * App-wide voice-call engine: owns the WebRTC peer connection, microphone
 * stream and Socket.IO signaling. Renders the call overlay and a hidden
 * audio sink for the remote stream. Exposed through `useCall()`.
 */
export function CallProvider({ children }) {
  const [call, setCall] = useState(null);

  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const iceServersRef = useRef(null);
  const durationTimerRef = useRef(null);
  const ringTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  /** Mirrors `call` for synchronous reads inside socket handlers. */
  const callRef = useRef(null);

  const update = useCallback((patch) => {
    setCall((prev) => {
      const base = prev ?? {};
      const next = typeof patch === "function" ? patch(base) : { ...base, ...patch };
      callRef.current = next;
      return next;
    });
  }, []);

  const clearCall = useCallback(() => {
    callRef.current = null;
    setCall(null);
  }, []);

  const stopDurationTimer = useCallback(() => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    durationTimerRef.current = null;
  }, []);

  const clearTimers = useCallback(() => {
    stopDurationTimer();
    if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    ringTimerRef.current = null;
  }, [stopDurationTimer]);

  const teardownMedia = useCallback(() => {
    clearTimers();
    if (pcRef.current) {
      try {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.onconnectionstatechange = null;
        pcRef.current.close();
      } catch {
        /* already closed */
      }
    }
    pcRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    pendingCandidatesRef.current = [];
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
  }, [clearTimers]);

  /** Closes the overlay immediately (used by the party that hangs up / declines). */
  const closeNow = useCallback(() => {
    teardownMedia();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    clearCall();
  }, [teardownMedia, clearCall]);

  /** Shows a terminal status briefly, then closes the overlay. */
  const finishCall = useCallback(
    (endReason) => {
      teardownMedia();
      update((prev) => ({ ...prev, phase: CALL_PHASE.ENDED, endReason }));
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        clearCall();
      }, ENDED_OVERLAY_MS);
    },
    [teardownMedia, update, clearCall],
  );

  const emit = useCallback((event, payload, ack) => {
    const socket = socketRef.current;
    if (!socket) return;
    if (ack) socket.emit(event, payload, ack);
    else socket.emit(event, payload);
  }, []);

  const ensureIceServers = useCallback(async () => {
    if (iceServersRef.current) return iceServersRef.current;
    try {
      const servers = await getIceServers();
      iceServersRef.current = servers.length ? servers : FALLBACK_ICE_SERVERS;
    } catch {
      iceServersRef.current = FALLBACK_ICE_SERVERS;
    }
    return iceServersRef.current;
  }, []);

  const startDurationTimer = useCallback(() => {
    if (durationTimerRef.current) return;
    const startedAt = Date.now();
    durationTimerRef.current = setInterval(() => {
      update((prev) => ({
        ...prev,
        durationSec: Math.floor((Date.now() - startedAt) / 1000),
      }));
    }, 1000);
  }, [update]);

  const attachRemoteTrack = useCallback((stream) => {
    remoteStreamRef.current = stream;
    const el = remoteAudioRef.current;
    if (el) {
      el.srcObject = stream;
      el.play?.().catch(() => {
        /* autoplay may require a gesture; the accept/call click usually satisfies it */
      });
    }
  }, []);

  const createPeer = useCallback(
    async (callId) => {
      const iceServers = await ensureIceServers();
      const pc = new RTCPeerConnection({ iceServers });
      pc.onicecandidate = (event) => {
        if (event.candidate) emit("call:ice", { callId, candidate: event.candidate });
      };
      pc.ontrack = (event) => {
        attachRemoteTrack(event.streams[0]);
      };
      pc.onconnectionstatechange = () => {
        const stateName = pc.connectionState;
        if (stateName === "connected") {
          if (callRef.current?.callId !== callId) return;
          update((prev) => ({ ...prev, phase: CALL_PHASE.CONNECTED }));
          startDurationTimer();
        } else if (stateName === "failed") {
          if (callRef.current?.callId !== callId) return;
          emit("call:end", { callId });
          finishCall("failed");
        }
      };
      pcRef.current = pc;
      return pc;
    },
    [ensureIceServers, emit, attachRemoteTrack, update, startDurationTimer, finishCall],
  );

  const acquireMic = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    localStreamRef.current = stream;
    return stream;
  }, []);

  const flushCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    const queued = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];
    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        /* ignore malformed candidate */
      }
    }
  }, []);

  // ── Public actions ──────────────────────────────────────────────────────

  const startCall = useCallback(
    (chat) => {
      if (!chat?.id || !chat.otherUserId) return;
      if (callRef.current) {
        toast("You are already in a call");
        return;
      }
      update({
        phase: CALL_PHASE.CALLING,
        direction: "outgoing",
        callId: null,
        conversationId: chat.id,
        peer: {
          id: chat.otherUserId,
          name: chat.name,
          avatar: chat.avatar || null,
          initials: chat.initials || null,
        },
        muted: false,
        durationSec: 0,
        endReason: null,
      });
      emit("call:initiate", { conversationId: chat.id }, (res) => {
        if (!callRef.current || callRef.current.phase !== CALL_PHASE.CALLING) return;
        if (!res || res.error) {
          toast.error(ackErrorMessage(res?.error));
          finishCall(ackErrorReason(res?.error));
          return;
        }
        update((prev) => ({ ...prev, callId: res.callId, phase: CALL_PHASE.RINGING }));
        if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
        ringTimerRef.current = setTimeout(() => {
          if (callRef.current?.phase === CALL_PHASE.RINGING) {
            emit("call:end", { callId: res.callId });
            finishCall("no-answer");
          }
        }, CALL_RING_TIMEOUT_MS + 5000);
      });
    },
    [update, emit, finishCall],
  );

  const acceptCall = useCallback(async () => {
    const current = callRef.current;
    if (!current || current.phase !== CALL_PHASE.INCOMING) return;
    const { callId } = current;
    update((prev) => ({ ...prev, phase: CALL_PHASE.CONNECTING }));
    try {
      const stream = await acquireMic();
      const pc = await createPeer(callId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      emit("call:accept", { callId });
    } catch {
      toast.error("Microphone access is required for voice calls");
      emit("call:reject", { callId });
      finishCall("mic-denied");
    }
  }, [update, acquireMic, createPeer, emit, finishCall]);

  const declineCall = useCallback(() => {
    const current = callRef.current;
    if (!current?.callId) {
      closeNow();
      return;
    }
    emit("call:reject", { callId: current.callId });
    closeNow();
  }, [emit, closeNow]);

  const endCall = useCallback(() => {
    const current = callRef.current;
    if (!current) return;
    if (current.callId) emit("call:end", { callId: current.callId });
    closeNow();
  }, [emit, closeNow]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const nextMuted = !(callRef.current?.muted ?? false);
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    update((prev) => ({ ...prev, muted: nextMuted }));
  }, [update]);

  // ── Signaling handlers ──────────────────────────────────────────────────

  const handleIncoming = useCallback(
    ({ callId, conversationId, caller }) => {
      const active = callRef.current;
      if (active && active.phase !== CALL_PHASE.ENDED) {
        // Already engaged; refuse without disturbing the active call.
        emit("call:reject", { callId });
        return;
      }
      if (active && active.phase === CALL_PHASE.ENDED) {
        // A previous call is still lingering on screen; clear it first.
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
        teardownMedia();
      }
      update({
        phase: CALL_PHASE.INCOMING,
        direction: "incoming",
        callId,
        conversationId,
        peer: {
          id: caller?.id || null,
          name: caller?.name || "Unknown caller",
          avatar: caller?.avatar || null,
          initials: caller?.initials || null,
        },
        muted: false,
        durationSec: 0,
        endReason: null,
      });
    },
    [emit, update, teardownMedia],
  );

  const handleAccepted = useCallback(
    async ({ callId }) => {
      const current = callRef.current;
      if (!current || current.callId !== callId || current.direction !== "outgoing") return;
      update((prev) => ({ ...prev, phase: CALL_PHASE.CONNECTING }));
      try {
        const stream = await acquireMic();
        const pc = await createPeer(callId);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emit("call:offer", { callId, sdp: pc.localDescription });
      } catch {
        toast.error("Microphone access is required for voice calls");
        emit("call:end", { callId });
        finishCall("mic-denied");
      }
    },
    [update, acquireMic, createPeer, emit, finishCall],
  );

  const handleOffer = useCallback(
    async ({ callId, sdp }) => {
      const pc = pcRef.current;
      if (!pc || callRef.current?.callId !== callId) return;
      try {
        await pc.setRemoteDescription(sdp);
        await flushCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        emit("call:answer", { callId, sdp: pc.localDescription });
      } catch {
        emit("call:end", { callId });
        finishCall("failed");
      }
    },
    [flushCandidates, emit, finishCall],
  );

  const handleAnswer = useCallback(
    async ({ callId, sdp }) => {
      const pc = pcRef.current;
      if (!pc || callRef.current?.callId !== callId) return;
      try {
        await pc.setRemoteDescription(sdp);
        await flushCandidates();
      } catch {
        emit("call:end", { callId });
        finishCall("failed");
      }
    },
    [flushCandidates, emit, finishCall],
  );

  const handleIce = useCallback(
    async ({ callId, candidate }) => {
      if (callRef.current?.callId !== callId || !candidate) return;
      const pc = pcRef.current;
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(candidate);
        } catch {
          /* ignore */
        }
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    },
    [],
  );

  const handleRejected = useCallback(
    ({ callId }) => {
      if (callRef.current?.callId === callId) finishCall("rejected");
    },
    [finishCall],
  );

  const handleCancelled = useCallback(
    ({ callId }) => {
      if (callRef.current?.callId === callId) closeNow();
    },
    [closeNow],
  );

  const handleEnded = useCallback(
    ({ callId, reason }) => {
      if (callRef.current?.callId === callId) finishCall(reason || "ended");
    },
    [finishCall],
  );

  // ── Socket lifecycle ────────────────────────────────────────────────────

  useEffect(() => {
    const socket = acquireSocket();
    socketRef.current = socket;

    const listeners = {
      "call:incoming": handleIncoming,
      "call:accepted": handleAccepted,
      "call:offer": handleOffer,
      "call:answer": handleAnswer,
      "call:ice": handleIce,
      "call:rejected": handleRejected,
      "call:cancelled": handleCancelled,
      "call:ended": handleEnded,
      "session:revoked": () => closeNow(),
    };
    Object.entries(listeners).forEach(([event, fn]) => socket.on(event, fn));

    return () => {
      Object.entries(listeners).forEach(([event, fn]) => socket.off(event, fn));
      teardownMedia();
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
      socketRef.current = null;
      releaseSocket();
    };
  }, [
    handleIncoming,
    handleAccepted,
    handleOffer,
    handleAnswer,
    handleIce,
    handleRejected,
    handleCancelled,
    handleEnded,
    closeNow,
    teardownMedia,
  ]);

  useCallRingtone(call);

  const value = useMemo(
    () => ({
      call,
      isBusy: Boolean(call),
      startCall,
      acceptCall,
      declineCall,
      endCall,
      toggleMute,
    }),
    [call, startCall, acceptCall, declineCall, endCall, toggleMute],
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      <CallOverlay />
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
    </CallContext.Provider>
  );
}
