import { Loader2 } from 'lucide-react';
import DashboardPage from '@/components/layout/DashboardPage';
import Card from '@/components/ui/Card';
import StatusBanner from '../components/status/StatusBanner';
import SubscriptionHeader from '../components/layout/SubscriptionHeader';
import CycleToggle from '../components/plans/CycleToggle';
import PlanPricePanel from '../components/plans/PlanPricePanel';
import PlanFeaturesPanel from '../components/plans/PlanFeaturesPanel';
import CancelSubscriptionModal from '@/components/modals/subscription/CancelSubscriptionModal';
import { useSubscriptionPage } from '../hooks/useSubscriptionPage';

const SubscriptionView = () => {
  const page = useSubscriptionPage();

  return (
    <DashboardPage width="medium" spacing="relaxed">
      {page.showBanner && (
        <div className="mb-2">
          <StatusBanner subscription={page.currentSub} trialDaysLeft={page.trialDaysLeft} />
        </div>
      )}

      <SubscriptionHeader paymentConfigured={page.paymentConfigured} />

      {page.plansLoading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : !page.plan ? (
        <p className="mt-10 text-center text-[14px] text-[#64748B]">
          Unable to load subscription plans.
        </p>
      ) : (
        <>
          <CycleToggle planOptions={page.planOptions} cycle={page.cycle} onChange={page.setCycle} />

          <Card className="mt-6 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <PlanPricePanel
                plan={page.plan}
                saving={page.saving}
                alreadyOnPlan={page.alreadyOnPlan}
                subscribeLabel={page.subscribeLabel}
                onSubscribe={page.startCheckout}
                showCancel={page.showCancel}
                onCancel={page.openCancel}
              />
              <PlanFeaturesPanel features={page.features} membershipEnded={page.membershipEnded} />
            </div>
          </Card>
        </>
      )}

      <CancelSubscriptionModal
        open={page.confirmCancelOpen}
        isTrial={page.isTrial}
        saving={page.saving}
        onClose={page.closeCancel}
        onConfirm={page.confirmCancel}
      />
    </DashboardPage>
  );
};

export default SubscriptionView;
