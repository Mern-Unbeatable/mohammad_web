import { formatCallDuration } from "./callConfig";

/**
 * Derives a human-readable summary for a CALL-type chat message from the
 * viewer's perspective. The message `event` carries { status, durationSec,
 * callerId } written by the server when a call concludes.
 */
export function callMessageSummary(message, currentUserId) {
  const event = message?.event || {};
  const status = event.status || "COMPLETED";
  const callerId = event.callerId || message?.senderId || null;
  const direction =
    currentUserId && callerId && callerId === currentUserId ? "outgoing" : "incoming";
  const durationSec = Number(event.durationSec) || 0;

  let label;
  let missed = false;
  switch (status) {
    case "COMPLETED":
      label = direction === "outgoing" ? "Outgoing voice call" : "Incoming voice call";
      break;
    case "MISSED":
      label = direction === "outgoing" ? "No answer" : "Missed voice call";
      missed = direction === "incoming";
      break;
    case "REJECTED":
      label = direction === "outgoing" ? "Call declined" : "Declined voice call";
      break;
    case "CANCELLED":
      label = direction === "outgoing" ? "Cancelled call" : "Missed voice call";
      missed = direction === "incoming";
      break;
    case "FAILED":
      label = "Call failed";
      break;
    default:
      label = "Voice call";
  }

  return {
    status,
    direction,
    durationSec,
    missed,
    label,
    durationLabel: durationSec > 0 ? formatCallDuration(durationSec) : null,
  };
}

/** Builds the `call` view model attached to CALL messages in the thread. */
export function toCallMessageModel(message, currentUserId) {
  return callMessageSummary(message, currentUserId);
}
