import { Link } from 'react-router';
import Notice from '../common/Notice';
import BackToSignIn from '@/modules/auth/components/BackToSignIn';
import {
  FORGOT_PASSWORD_PATH,
  INVALID_LINK_MESSAGE,
  MISSING_LINK_MESSAGE,
  PRIMARY_BUTTON_CLASS,
} from '../../constant/constants';

/** Bad, expired or missing token: explain and offer a new link. */
const InvalidLinkState = ({ hasToken, message }) => (
  <div className="space-y-5">
    <Notice>
      <p>{hasToken ? message || INVALID_LINK_MESSAGE : MISSING_LINK_MESSAGE}</p>
    </Notice>
    <Link to={FORGOT_PASSWORD_PATH} className={PRIMARY_BUTTON_CLASS}>
      Request a new reset link
    </Link>
    <BackToSignIn />
  </div>
);

export default InvalidLinkState;
