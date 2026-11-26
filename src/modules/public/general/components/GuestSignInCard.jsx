import { Link } from 'react-router';
import { JOIN_PATH, LOGIN_PATH } from '../constant/constants';

/** Sidebar sign-in CTA for guests on public General post detail. */
const GuestSignInCard = () => (
  <section className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <h2 className="text-[18px] font-bold text-deep-blue">Sign in</h2>
    <p className="mt-2 text-[13px] leading-relaxed text-[#667085]">
      Log in or create an account to keep reading, comment, and join the Lab Unity community.
    </p>
    <div className="mt-4 flex flex-col gap-2">
      <Link
        to={LOGIN_PATH}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Log in
      </Link>
      <Link
        to={JOIN_PATH}
        className="flex w-full items-center justify-center rounded-lg border border-primary/30 bg-[#E8F3FB] px-4 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-[#D3E8F7]"
      >
        Sign up
      </Link>
    </div>
  </section>
);

export default GuestSignInCard;
