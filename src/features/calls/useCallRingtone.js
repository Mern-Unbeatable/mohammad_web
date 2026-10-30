import { useEffect, useRef } from "react";
import { CALL_PHASE, RINGTONE_SRC } from "./callConfig";

/** Which looped ringtone (if any) matches a given call phase/direction. */
function toneFor(call) {
  if (!call) return null;
  if (call.phase === CALL_PHASE.INCOMING) return "incoming";
  if (
    call.direction === "outgoing" &&
    (call.phase === CALL_PHASE.CALLING || call.phase === CALL_PHASE.RINGING)
  ) {
    return "outgoing";
  }
  return null;
}

/**
 * WhatsApp-style ringtones synchronized to the call lifecycle.
 *
 * Playback is derived from the call phase (not socket events), so repeated or
 * out-of-order events never start a second ringtone. A one-time user-gesture
 * "unlock" primes the audio elements so the receiver's incoming ring can play
 * despite browser autoplay restrictions. Audio elements are separate from the
 * WebRTC remote stream, so they never interfere with the actual conversation.
 */
export function useCallRingtone(call) {
  const incomingRef = useRef(null);
  const outgoingRef = useRef(null);
  const currentToneRef = useRef(null);

  // Create the looped audio elements once and unlock them on first interaction.
  useEffect(() => {
    const incoming = new Audio(RINGTONE_SRC.incoming);
    const outgoing = new Audio(RINGTONE_SRC.outgoing);
    [incoming, outgoing].forEach((audio) => {
      audio.loop = true;
      audio.preload = "auto";
    });
    incomingRef.current = incoming;
    outgoingRef.current = outgoing;

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      [incoming, outgoing].forEach((audio) => {
        audio.muted = true;
        const ready = audio.play();
        if (ready?.then) {
          ready
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.muted = false;
            })
            .catch(() => {
              audio.muted = false;
            });
        } else {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        }
      });
      removeUnlockListeners();
    };
    const events = ["pointerdown", "keydown", "touchstart"];
    const removeUnlockListeners = () =>
      events.forEach((event) => window.removeEventListener(event, unlock));
    events.forEach((event) =>
      window.addEventListener(event, unlock, { passive: true }),
    );

    return () => {
      removeUnlockListeners();
      [incoming, outgoing].forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      incomingRef.current = null;
      outgoingRef.current = null;
      currentToneRef.current = null;
    };
  }, []);

  // Sync playback to the desired tone whenever the call phase changes.
  const tone = toneFor(call);
  useEffect(() => {
    if (currentToneRef.current === tone) return;
    currentToneRef.current = tone;

    const stop = (audio) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    };
    const play = (audio) => {
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {
        /* autoplay blocked until the user interacts; ring resumes on next change */
      });
    };

    if (tone === "incoming") {
      stop(outgoingRef.current);
      play(incomingRef.current);
    } else if (tone === "outgoing") {
      stop(incomingRef.current);
      play(outgoingRef.current);
    } else {
      stop(incomingRef.current);
      stop(outgoingRef.current);
    }
  }, [tone]);
}
