import { Link } from 'react-router';
import { AlertCircle, Mail } from 'lucide-react';
import { CONTACT_SUPPORT_PATH } from '@/shared/constants/support';

const SuspensionNotice = ({ reason, email }) => (
  <div
    role="alert"
    className="mb-6 flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left"
  >
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="min-w-0 text-[14px] leading-[1.6] text-red-700">
      <p className="font-semibold">Account suspended</p>
      {reason ? (
        <p className="mt-1 whitespace-pre-wrap break-words">
          Your account has been suspended because: {reason}
        </p>
      ) : (
        <p className="mt-1">Your account has been suspended.</p>
      )}
      <p className="mt-1 text-red-600">
        If you think this is a mistake, please contact support.
      </p>
      <Link
        to={CONTACT_SUPPORT_PATH}
        state={{ suspended: true, email, reason }}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
      >
        <Mail className="h-4 w-4" />
        Contact support
      </Link>
    </div>
  </div>
);

export default SuspensionNotice;
