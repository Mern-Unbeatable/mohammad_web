import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useCall } from "@/features/calls/callContext";
import { CALL_PHASE, callStatusLabel, formatCallDuration } from "@/features/calls/callConfig";

const CONTROL_BASE =
  "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/**
 * Full-screen voice-call surface for the active call. Driven entirely by the
 * CallProvider state; renders nothing when no call is in progress.
 */
const CallOverlay = () => {
  const { call, acceptCall, declineCall, endCall, toggleMute } = useCall();
  if (!call) return null;

  const { phase, direction, peer = {}, muted, durationSec, endReason } = call;
  const isConnected = phase === CALL_PHASE.CONNECTED;
  const isIncoming = phase === CALL_PHASE.INCOMING;
  const status = callStatusLabel(phase, { direction, endReason });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${direction === "outgoing" ? "Outgoing" : "Incoming"} voice call`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-blue/80 backdrop-blur-sm p-4"
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white px-6 py-10 text-center shadow-2xl">
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <Phone className="h-3 w-3" />
          Voice call
        </span>

        <div className={isIncoming || phase === CALL_PHASE.RINGING ? "animate-pulse" : ""}>
          <Avatar src={peer.avatar} alt={peer.name} initials={peer.initials} size="xl" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-deep-blue">{peer.name}</h2>
        <p className="mt-1.5 text-sm text-[#64748B]" aria-live="polite">
          {status}
        </p>
        {isConnected ? (
          <p className="mt-1 font-mono text-lg font-medium text-deep-blue tabular-nums">
            {formatCallDuration(durationSec)}
          </p>
        ) : null}

        <div className="mt-10 flex items-center justify-center gap-6">
          {isIncoming ? (
            <>
              <button
                type="button"
                onClick={declineCall}
                aria-label="Decline call"
                className={`${CONTROL_BASE} bg-[#CC1016] hover:bg-[#a60d12] focus-visible:ring-[#CC1016]`}
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={acceptCall}
                aria-label="Accept call"
                className={`${CONTROL_BASE} bg-[#16A34A] hover:bg-[#15803d] focus-visible:ring-[#16A34A]`}
              >
                <Phone className="h-6 w-6" />
              </button>
            </>
          ) : phase === CALL_PHASE.ENDED ? (
            <button
              type="button"
              onClick={endCall}
              aria-label="Close"
              className={`${CONTROL_BASE} bg-[#64748B] hover:bg-[#475467] focus-visible:ring-[#64748B]`}
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMute}
                disabled={!isConnected}
                aria-pressed={muted}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                className={`${CONTROL_BASE} ${
                  muted
                    ? "bg-[#F59E0B] hover:bg-[#d97f06] focus-visible:ring-[#F59E0B]"
                    : "bg-[#475467] hover:bg-[#344054] focus-visible:ring-[#475467]"
                } disabled:opacity-40`}
              >
                {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <button
                type="button"
                onClick={endCall}
                aria-label={direction === "outgoing" && !isConnected ? "Cancel call" : "End call"}
                className={`${CONTROL_BASE} bg-[#CC1016] hover:bg-[#a60d12] focus-visible:ring-[#CC1016]`}
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
