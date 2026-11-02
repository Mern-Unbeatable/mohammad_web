import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { confirmCheckout, fetchMySubscription } from '@/features/dash/user/subscriptions';
import { fetchUserProfile } from '@/features/dash/user/profile';
import { CHECKOUT_PARAM, CHECKOUT_STATUS, SESSION_ID_PARAM } from '../constant/constants';

/** Handles the Stripe redirect once: confirms the session, clears the params, refreshes state. */
export const useCheckoutReturn = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const checkout = searchParams.get(CHECKOUT_PARAM);
    if (!checkout) return;

    handled.current = true;
    const sessionId = searchParams.get(SESSION_ID_PARAM);
    setSearchParams({}, { replace: true });

    const finish = async () => {
      if (checkout === CHECKOUT_STATUS.SUCCESS && sessionId) {
        const result = await dispatch(confirmCheckout(sessionId));
        if (confirmCheckout.fulfilled.match(result)) {
          // Trust the reconciled backend status, not the redirect alone.
          const status = String(result.payload?.status || '').toUpperCase();
          if (status === 'ACTIVE') {
            toast.success('Payment successful — membership activated');
          } else if (status === 'PAST_DUE') {
            toast.error('Payment problem — please update your payment method');
          } else {
            toast('Payment received — activating membership. Refresh if status lags.');
          }
        } else {
          toast('Payment received — activating membership. Refresh if status lags.');
        }
      } else if (checkout === CHECKOUT_STATUS.CANCELLED) {
        toast('Checkout cancelled — no payment was taken');
      }

      dispatch(fetchMySubscription());
      dispatch(fetchUserProfile());
    };

    void finish();
  }, [dispatch, searchParams, setSearchParams]);
};
