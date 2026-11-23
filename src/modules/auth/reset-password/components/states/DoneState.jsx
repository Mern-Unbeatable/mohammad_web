import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { LOGIN_PATH, PRIMARY_BUTTON_CLASS } from '../../constant/constants';

const DoneState = () => (
  <div className="space-y-5 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
      <CheckCircle2 className="h-7 w-7 text-primary" />
    </div>
    <p className="text-[15px] leading-[1.6] text-[#475467]">
      Your password has been changed and you&apos;ve been signed out of other devices.
    </p>
    <Link to={LOGIN_PATH} replace className={PRIMARY_BUTTON_CLASS}>
      Continue to Sign In
    </Link>
  </div>
);

export default DoneState;
