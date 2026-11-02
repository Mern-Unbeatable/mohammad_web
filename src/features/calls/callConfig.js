/** Fallback ICE servers used until the server config loads (public STUN only). */
export const FALLBACK_ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

/**
 * Distinct, looped ringtone assets (served from web/public/audio).
 * - incoming: played on the receiver while the call is ringing
 * - outgoing: ringback played on the caller while waiting for an answer
 */
export const RINGTONE_SRC = {
  incoming: "/audio/ringtone.mp3",
  outgoing: "/audio/freesound.mp3",
};

/** Call lifecycle phases tracked on the client. */
export const CALL_PHASE = {
  IDLE: "idle",
  CALLING: "calling", // outgoing, contacting the server
  RINGING: "ringing", // outgoing, waiting for the other side to answer
  INCOMING: "incoming", // an incoming call is being offered
  CONNECTING: "connecting", // accepted, negotiating media
  CONNECTED: "connected", // media flowing
  ENDED: "ended", // terminal, overlay about to close
};

/** How long a ringing call waits before the client gives up (matches server ring timeout). */
export const CALL_RING_TIMEOUT_MS = 45_000;

/** Human-readable status line shown on the call overlay. */
export function callStatusLabel(phase, { direction, endReason } = {}) {
  switch (phase) {
    case CALL_PHASE.CALLING:
      return "Calling…";
    case CALL_PHASE.RINGING:
      return "Ringing…";
    case CALL_PHASE.INCOMING:
      return "Incoming voice call";
    case CALL_PHASE.CONNECTING:
      return "Connecting…";
    case CALL_PHASE.CONNECTED:
      return "Connected";
    case CALL_PHASE.ENDED:
      return endReasonLabel(endReason, direction);
    default:
      return "";
  }
}

function endReasonLabel(endReason, direction) {
  switch (endReason) {
    case "rejected":
      return "Call declined";
    case "cancelled":
      return "Call cancelled";
    case "no-answer":
      return direction === "outgoing" ? "No answer" : "Missed call";
    case "busy":
      return "User is busy";
    case "offline":
      return "User is unavailable";
    case "disconnected":
      return "Call disconnected";
    case "failed":
      return "Call failed";
    case "mic-denied":
      return "Microphone unavailable";
    default:
      return "Call ended";
  }
}

/** mm:ss (or h:mm:ss) duration from seconds. */
export function formatCallDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const mm = String(minutes).padStart(hours ? 2 : 1, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
}

const ACK_ERROR_REASON = {
  "in-call": "You are already in a call",
  busy: "This person is on another call",
  offline: "This person is offline",
  forbidden: "You cannot call this person",
  "group-unsupported": "Voice calls are only available in direct chats",
  "not-direct": "Voice calls are only available in direct chats",
  invalid: "Could not start the call",
  failed: "Could not start the call",
};

export function ackErrorMessage(code) {
  return ACK_ERROR_REASON[code] || "Could not start the call";
}

/** Maps an ack error code to the overlay end reason. */
export function ackErrorReason(code) {
  if (code === "busy") return "busy";
  if (code === "offline") return "offline";
  return "failed";
}
