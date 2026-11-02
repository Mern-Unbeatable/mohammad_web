import { createContext, useContext } from "react";

export const CallContext = createContext(null);

/** Safe default so consuming components never crash when no provider is mounted (e.g. tests). */
export const NOOP_CALL = {
  call: null,
  isBusy: false,
  startCall: () => {},
  acceptCall: () => {},
  declineCall: () => {},
  endCall: () => {},
  toggleMute: () => {},
};

export function useCall() {
  return useContext(CallContext) || NOOP_CALL;
}
