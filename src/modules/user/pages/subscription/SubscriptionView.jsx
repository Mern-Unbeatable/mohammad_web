import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Clock, Loader2, Mail, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import {
  fetchPlans,
  fetchMySubscription,
  subscribe,
  confirmCheckout,
  cancelSubscription,
  clearSubscriptionsError,
  toPlansList,
  toSubscriptionModel,
} from '@/features/user/subscriptions';
import {
  fetchUserProfile,
  toProfilePageUser,
} from '@/features/user/profile';
import CancelSubscriptionModal from '@/modules/user/components/subscription/CancelSubscriptionModal';
import { SUPPORT_CONTACT } from '@/shared/constants/support';

const PLAN_API = {
  monthly: 'MONTHLY',
  yearly: 'YEARLY',
};

const StatusBanner = ({ subscription, trialDaysLeft }) => {
  if (!subscription) return null;
  const { status, cancelAtPeriodEnd, accessEndsAt, plan } = subscription;

  if (status === 'TRIAL' && trialDaysLeft > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5D78E] bg-[#FEF9E6] px-3 py-1 text-[12px] font-semibold text-[#B8860B]">
        <Clock className="h-3.5 w-3.5" />
        Free trial ends in {trialDaysLeft} days
      </span>
    );
  }

  if (status === 'ACTIVE' && !cancelAtPeriodEnd) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-primary/30 bg-green-secondary px-3 py-1 text-[12px] font-semibold text-green-primary">
        Active · {plan === 'YEARLY' ? 'Yearly' : 'Monthly'} membership
      </span>
    );
  }

  if (status === 'CANCELLED' && cancelAtPeriodEnd) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5D78E] bg-[#FEF9E6] px-3 py-1 text-[12px] font-semibold text-[#B8860B]">
        Cancels at period end
        {accessEndsAt
          ? ` · access until ${new Date(accessEndsAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}`
          : ''}
      </span>
    );
  }

  if (status === 'EXPIRED' || status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1 text-[12px] font-semibold text-[#DC2626]">
        {status === 'EXPIRED' ? 'Membership expired' : 'Membership cancelled'}
      </span>
    );
  }

  return null;
};

const SubscriptionView = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutHandled = useRef(false);
  const { plans, plansLoading, saving, subscription, loading, error } =
    useSelector((state) => state.userSubscriptions);
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const planOptions = useMemo(() => {
    const list = toPlansList(plans);
    if (list.length) {
      return Object.fromEntries(
        list.map((plan) => [String(plan.id).toLowerCase(), plan]),
      );
    }
    return null;
  }, [plans]);

  const currentSub = useMemo(() => {
    if (subscription) return toSubscriptionModel(subscription);
    return toSubscriptionModel(profileUser?.raw?.subscription);
  }, [subscription, profileUser]);

  const [cycle, setCycle] = useState('monthly');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    dispatch(clearSubscriptionsError());
    dispatch(fetchPlans());
    dispatch(fetchMySubscription());
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (checkoutHandled.current) return;

    const checkout = searchParams.get('checkout');
    if (!checkout) return;

    checkoutHandled.current = true;
    const sessionId = searchParams.get('session_id');
    setSearchParams({}, { replace: true });

    const finish = async () => {
      if (checkout === 'success' && sessionId) {
        const result = await dispatch(confirmCheckout(sessionId));
        if (confirmCheckout.fulfilled.match(result)) {
          toast.success('Payment successful — membership activated');
        } else {
          toast.info(
            'Payment received — activating membership. Refresh if status lags.',
          );
        }
      } else if (checkout === 'cancelled') {
        toast.info('Checkout cancelled — no payment was taken');
      }

      dispatch(fetchMySubscription());
      dispatch(fetchUserProfile());
    };

    void finish();
  }, [dispatch, searchParams, setSearchParams]);

  useEffect(() => {
    if (!planOptions) return;
    if (!planOptions[cycle]) {
      const first = Object.keys(planOptions)[0];
      if (first) setCycle(first);
    }
  }, [planOptions, cycle]);

  useEffect(() => {
    if (!currentSub?.plan) return;
    const key = String(currentSub.plan).toLowerCase();
    if (key === 'monthly' || key === 'yearly') setCycle(key);
  }, [currentSub?.plan]);

  const plan = planOptions?.[cycle];
  const features =
    (Array.isArray(plans?.features) && plans.features) ||
    plan?.features ||
    [];

  const trialDaysLeft =
    currentSub?.trialDaysLeft ?? profileUser?.trialDaysLeft ?? 0;

  const alreadyOnPlan =
    currentSub?.status === 'ACTIVE' &&
    !currentSub?.cancelAtPeriodEnd &&
    String(currentSub?.plan || '').toUpperCase() ===
      (PLAN_API[cycle] || String(cycle).toUpperCase());

  const canCancel =
    currentSub?.status === 'ACTIVE' ||
    currentSub?.status === 'TRIAL' ||
    (currentSub?.status === 'CANCELLED' && currentSub?.cancelAtPeriodEnd);

  const handleSubscribe = async () => {
    if (alreadyOnPlan || saving) return;
    const apiPlan = PLAN_API[cycle] || String(cycle).toUpperCase();
    const result = await dispatch(subscribe(apiPlan));
    if (!subscribe.fulfilled.match(result)) return;

    const payment = result.payload?.payment;
    if (payment?.checkoutUrl) {
      toast.info('Redirecting to Stripe Checkout…');
      window.location.assign(payment.checkoutUrl);
      return;
    }

    toast.error('Checkout session could not be started. Try again.');
  };

  const handleCancel = async () => {
    if (!canCancel || saving) return;
    const result = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(result)) {
      setConfirmCancelOpen(false);
      toast.success(
        currentSub?.status === 'TRIAL'
          ? 'Trial cancelled'
          : 'Subscription cancelled — access continues until period end',
      );
      dispatch(fetchMySubscription());
      dispatch(fetchUserProfile());
    }
  };

  const subscribeLabel = alreadyOnPlan
    ? 'Current plan'
    : currentSub?.status === 'ACTIVE' || currentSub?.cancelAtPeriodEnd
      ? `Switch to ${plan?.label || 'plan'}`
      : plan?.subscribeLabel;

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[920px]">
        {(loading || profileUser) && (
          <div className="mb-2">
            <StatusBanner
              subscription={currentSub}
              trialDaysLeft={trialDaysLeft}
            />
          </div>
        )}

        <h1 className="mt-5 text-[28px] font-bold leading-tight text-deep-blue sm:text-[34px]">
          Choose your billing cycle
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">
          One plan. Full access. Pick how you want to pay.
        </p>

        {plans?.paymentConfigured === false ? (
          <p className="mt-3 text-[12px] text-[#DC2626]">
            Stripe is not configured on the server. Paid checkout is unavailable
            until Stripe keys and price IDs are set.
          </p>
        ) : null}

        {plansLoading && !planOptions ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : !plan ? (
          <p className="mt-10 text-center text-[14px] text-[#64748B]">
            Unable to load subscription plans.
          </p>
        ) : (
          <>
            <div className="mt-6 inline-flex w-full max-w-[360px] rounded-xl bg-[#F3F4F6] p-1 sm:w-auto">
              {Object.values(planOptions).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCycle(String(option.id).toLowerCase())}
                  className={`flex-1 rounded-lg px-6 py-2.5 text-[13px] font-semibold transition-all sm:min-w-[140px] ${
                    cycle === String(option.id).toLowerCase()
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-[#64748B] hover:text-deep-blue'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Card className="mt-6 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="border-b border-[#E4E7EC] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <span className="inline-flex rounded-md bg-[#E67E22] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Lab Unity Membership
                  </span>

                  <p className="mt-5 text-[36px] font-bold leading-none text-deep-blue sm:text-[42px]">
                    {plan.price}
                    <span className="text-[18px] font-semibold text-[#64748B]">
                      {' '}
                      / {plan.period}
                    </span>
                  </p>
                  <p className="mt-3 text-[14px] text-[#64748B]">
                    No long-term commitment. Cancel anytime.
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <Shield className="h-4 w-4 shrink-0 text-primary" />
                      Secure payment
                    </li>
                    <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <RotateCcw className="h-4 w-4 shrink-0 text-primary" />
                      Cancel anytime
                    </li>
                    <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      Invoice provided
                    </li>
                    <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      {SUPPORT_CONTACT.email}
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={saving || alreadyOnPlan}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#066BB0] disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    {subscribeLabel}
                  </button>

                  {canCancel &&
                  (currentSub?.status === 'ACTIVE' ||
                    currentSub?.status === 'TRIAL') &&
                  !currentSub?.cancelAtPeriodEnd ? (
                    <button
                      type="button"
                      onClick={() => setConfirmCancelOpen(true)}
                      disabled={saving}
                      className="mt-3 w-full rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60"
                    >
                      Cancel subscription
                    </button>
                  ) : null}

                  <p className="mt-3 text-center text-[12px] text-primary">
                    No commitment — Cancel anytime from settings
                  </p>
                </div>

                <div className="bg-secondary p-6 sm:p-8">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Everything Included
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-green-primary"
                          strokeWidth={2.5}
                        />
                        <span className="text-[13px] leading-snug text-[#475467]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {currentSub?.status === 'EXPIRED' ||
                  (currentSub?.status === 'CANCELLED' &&
                    !currentSub?.isActive) ? (
                    <p className="mt-6 text-[13px] text-[#64748B]">
                      Your previous membership has ended. Choose a plan above to
                      restore full access.
                    </p>
                  ) : null}

                  <p className="mt-6 text-[12px] text-[#98A2B3]">
                    Need help?{' '}
                    <Link to="/profile" className="text-primary hover:underline">
                      View subscription details on your profile
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </Container>

      <CancelSubscriptionModal
        open={confirmCancelOpen}
        isTrial={currentSub?.status === 'TRIAL'}
        saving={saving}
        onClose={() => {
          if (!saving) setConfirmCancelOpen(false);
        }}
        onConfirm={handleCancel}
      />
    </main>
  );
};

export default SubscriptionView;
