import { Link } from 'react-router';
import { JOIN_PATH, LOGIN_PATH } from '../constant/constants';

/** Signup / login CTA shown when a guest hits the viewing limit or cannot interact. */
const GuestAuthPrompt = ({
  title = 'Continue reading on Lab Unity',
  message = 'Create a free account or log in to keep browsing General posts and join the conversation.',
  compact = false,
}) => (
  <div
    className={`rounded-2xl border border-[#E4E7EC] bg-white text-center ${
      compact ? 'px-5 py-6' : 'px-6 py-10 sm:px-10'
    }`}
  >
    <h2 className="text-[20px] font-bold text-deep-blue sm:text-[22px]">{title}</h2>
    <p className="mx-auto mt-2 max-w-lg text-[14px] leading-relaxed text-[#667085] sm:text-[15px]">
      {message}
    </p>
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      <Link
        to={JOIN_PATH}
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-[14px] font-semibold text-white hover:opacity-90"
      >
        Sign up
      </Link>
      <Link
        to={LOGIN_PATH}
        className="inline-flex items-center justify-center rounded-full border border-[#E4E7EC] bg-white px-6 py-2.5 text-[14px] font-semibold text-deep-blue hover:bg-[#F9FAFB]"
      >
        Log in
      </Link>
    </div>
  </div>
);

export default GuestAuthPrompt;
