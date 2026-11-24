import { RefreshCw } from 'lucide-react';
import Notice from '../common/Notice';
import BackToSignIn from '@/modules/auth/components/BackToSignIn';
import { CHECK_FAILED_MESSAGE, PRIMARY_BUTTON_CLASS } from '../../constant/constants';

/** The link could not be verified (network / server); offer a retry. */
const CheckErrorState = ({ message, onRetry }) => (
  <div className="space-y-5">
    <Notice>
      <p>{message || CHECK_FAILED_MESSAGE}</p>
    </Notice>
    <button type="button" onClick={onRetry} className={PRIMARY_BUTTON_CLASS}>
      <RefreshCw className="mr-2 h-4 w-4" />
      Try again
    </button>
    <BackToSignIn />
  </div>
);

export default CheckErrorState;
