import { Loader2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import SubscriptionHeader from '@/modules/dash/user/subscription/components/layout/SubscriptionHeader';
import CycleToggle from '@/modules/dash/user/subscription/components/plans/CycleToggle';
import PlanPricePanel from '@/modules/dash/user/subscription/components/plans/PlanPricePanel';
import PlanFeaturesPanel from '@/modules/dash/user/subscription/components/plans/PlanFeaturesPanel';
import { usePublicPricing } from '../hooks/usePublicPricing';

/** Public /pricing: the subscription page's plan card, without account state or checkout. */
const PricingView = () => {
  const pricing = usePublicPricing();

  return (
    <section className="flex-1 bg-gradient-to-br from-secondary via-white to-pink-secondary/60 py-10 lg:py-14 xl:py-16">
      <Container className="max-w-[920px]">
        <SubscriptionHeader paymentConfigured />

        {pricing.loading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : !pricing.plan ? (
          <div className="mt-10 text-center text-[14px] text-[#64748B]">
            <p>Unable to load subscription plans.</p>
            <button
              type="button"
              onClick={pricing.retry}
              className="mt-3 font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <CycleToggle
              planOptions={pricing.planOptions}
              cycle={pricing.cycle}
              onChange={pricing.setCycle}
            />

            <Card className="mt-6 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <PlanPricePanel
                  plan={pricing.plan}
                  subscribeLabel={pricing.actionLabel}
                  onSubscribe={pricing.onAction}
                />
                <PlanFeaturesPanel features={pricing.features} showHelp={false} />
              </div>
            </Card>
          </>
        )}
      </Container>
    </section>
  );
};

export default PricingView;
