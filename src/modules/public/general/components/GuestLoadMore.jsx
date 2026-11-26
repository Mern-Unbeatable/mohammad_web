import { Link } from 'react-router';
import { Lock } from 'lucide-react';
import { JOIN_PATH, LOGIN_PATH } from '../constant/constants';

/** Static “Load more” CTA for guests. Sign-in card stays below. */
const GuestLoadMore = () => (
  <div className="mt-8 flex flex-col items-center gap-3 text-center">
    <Link
      to={JOIN_PATH}
      className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-primary px-7 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
    >
      <Lock className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
      Load more
    </Link>
    <p className="text-[12px] text-[#98A2B3]">
      Already have an account?{' '}
      <Link to={LOGIN_PATH} className="font-semibold text-primary hover:underline">
        Log in
      </Link>
    </p>
  </div>
);

export default GuestLoadMore;
