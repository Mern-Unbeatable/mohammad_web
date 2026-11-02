/**
 * Voice-call feature public API.
 *
 * - CallProvider / useCall → app-wide WebRTC engine + signaling
 * - callConfig             → phases, labels, duration formatting
 * - callHistory            → CALL-message helpers for the chat thread
 * - callsApi               → ICE servers + call history HTTP
 */

export { CallProvider } from "./CallProvider";
export { useCall, CallContext } from "./callContext";
export {
  CALL_PHASE,
  callStatusLabel,
  formatCallDuration,
} from "./callConfig";
export { toCallMessageModel, callMessageSummary } from "./callHistory";
export * as callsApi from "./callsApi";
