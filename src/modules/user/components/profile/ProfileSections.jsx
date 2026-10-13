import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import { CardSkeleton } from '@/components/common/Skeleton';
import {
  cancelSubscription,
} from '@/features/user/subscriptions';
import { fetchUserProfile } from '@/features/user/profile';
import CancelSubscriptionModal from '@/modules/user/components/subscription/CancelSubscriptionModal';

export {
  InfoTile,
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
export { default as ProfileHero } from '@/components/data-display/ProfileHero/ProfileHero';

const emptySubscription = {
  planName: '—',
  status: '—',
  startDate: '—',
  renewalDate: '—',
  amount: '—',
  billingCycle: '—',
  nextPayment: '—',
  paymentMethod: '—',
};

export const SubscriptionDetailsCard = ({ subscription }) => {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.userSubscriptions);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const details = { ...emptySubscription, ...(subscription || {}) };
  const statusKey = String(
    details.statusKey || details.status || '',
  ).toUpperCase();
  const canCancel =
    (statusKey === 'ACTIVE' || statusKey === 'TRIAL') &&
    !details.cancelAtPeriodEnd;

  const statusClass =
    statusKey === 'ACTIVE'
      ? 'bg-green-secondary text-green-primary'
      : statusKey === 'TRIAL'
        ? 'bg-[#FEF9E6] text-[#B8860B]'
        : statusKey === 'CANCELLED'
          ? 'bg-[#FEF3E8] text-[#E67E22]'
          : 'bg-[#FEE2E2] text-[#DC2626]';

  const handleCancel = async () => {
    if (!canCancel || saving) return;
    const result = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(result)) {
      setConfirmOpen(false);
      toast.success(
        statusKey === 'TRIAL'
          ? 'Trial cancelled'
          : 'Subscription cancelled — access continues until period end',
      );
      dispatch(fetchUserProfile());
    } else if (cancelSubscription.rejected.match(result)) {
      toast.error(result.payload || 'Failed to cancel subscription');
    }
  };

  return (
    <Card className="h-full">
      <div className="flex items-center gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <span className="text-[16px] text-[#E67E22]">👑</span>
        <h2 className="text-[16px] font-bold text-deep-blue">Subscription Details</h2>
      </div>

      <dl className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
        {[
          ['Plan Name', details.planName],
          ['Status', details.status, true],
          ['Start Date', details.startDate],
          [
            details.cancelAtPeriodEnd ? 'Access Until' : 'Renewal Date',
            details.cancelAtPeriodEnd
              ? details.accessEndsAt || details.renewalDate
              : details.renewalDate,
          ],
          ['Amount', details.amount],
          ['Billing Cycle', details.billingCycle],
          ['Next Payment', details.cancelAtPeriodEnd ? '—' : details.nextPayment],
          ['Payment Method', details.paymentMethod],
        ].map(([label, value, isStatus]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-[13px] text-[#64748B]">{label}</dt>
            <dd className="text-right text-[13px] font-semibold text-deep-blue">
              {isStatus ? (
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass}`}
                >
                  {value}
                </span>
              ) : (
                value || '—'
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={!canCancel || saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {details.cancelAtPeriodEnd
            ? 'Cancellation scheduled'
            : 'Cancel Subscription'}
        </button>
      </div>

      <CancelSubscriptionModal
        open={confirmOpen}
        isTrial={statusKey === 'TRIAL'}
        saving={saving}
        onClose={() => {
          if (!saving) setConfirmOpen(false);
        }}
        onConfirm={handleCancel}
      />
    </Card>
  );
};

export const MyReportsCard = ({ reports = [], loading = false }) => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <h2 className="text-[16px] font-bold text-deep-blue">My reports</h2>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Reports you have submitted for review.
      </p>
    </div>

    {loading && !reports.length ? (
      <CardSkeleton
        variant="reportRow"
        count={3}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    ) : reports.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {reports.map((report) => (
          <li key={report.id} className="px-5 py-3.5 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-deep-blue">
                  {report.reason}
                  <span className="font-normal text-[#64748B]"> · {report.targetType}</span>
                </p>
                {report.targetSnippet ? (
                  <p className="mt-1 line-clamp-2 text-[12px] text-[#64748B]">
                    {report.targetSnippet}
                  </p>
                ) : null}
                <p className="mt-1 text-[11px] text-[#98A2B3]">{report.reportedDate}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#475467]">
                {report.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="px-5 py-8 text-center text-[13px] text-[#64748B] sm:px-6">
        You have not submitted any reports yet.
      </p>
    )}
  </Card>
);
