import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

/** Muted "← Back to Sign In" link under the auth forms. */
const BackToSignIn = () => (
  <Link
    to="/login"
    className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
  >
    <ArrowLeft className="h-4 w-4" />
    Back to Sign In
  </Link>
);

export default BackToSignIn;
