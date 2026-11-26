import { Link } from 'react-router';
import { JOIN_PATH, LOGIN_PATH } from '../constant/constants';

/** Replaces comment / interaction inputs for guests on public General posts. */
const GuestConversationPrompt = () => (
  <div className="mt-8 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-5 py-6 text-center">
    <p className="text-[15px] font-semibold text-deep-blue">
      Log in to join the conversation
    </p>
    <p className="mt-1 text-[13px] text-[#667085]">
      Members can comment, reply, and react after signing in.
    </p>
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      <Link
        to={LOGIN_PATH}
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-white hover:opacity-90"
      >
        Log in
      </Link>
      <Link
        to={JOIN_PATH}
        className="inline-flex items-center justify-center rounded-full border border-[#E4E7EC] bg-white px-5 py-2 text-[13px] font-semibold text-deep-blue hover:bg-white"
      >
        Sign up
      </Link>
    </div>
  </div>
);

export default GuestConversationPrompt;
