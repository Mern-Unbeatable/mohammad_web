import { ShieldAlert } from 'lucide-react';

/** Red box with the suspended account and the reason shown at sign-in. */
const SuspensionDetails = ({ accountEmail, reason }) => (
  <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left">
    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">
      <p className="font-semibold">Account suspended</p>
      {accountEmail ? (
        <p className="mt-1 break-words">Account: {accountEmail}</p>
      ) : null}
      {reason ? (
        <p className="mt-1 whitespace-pre-wrap break-words">Reason: {reason}</p>
      ) : null}
    </div>
  </div>
);

export default SuspensionDetails;
