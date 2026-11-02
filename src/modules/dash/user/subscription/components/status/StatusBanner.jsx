import { Clock } from 'lucide-react';
import { BANNER_TONE_CLASSES } from '../../constant/constants';
import { statusBanner } from '../../utils/subscriptionStatus';

const StatusBanner = ({ subscription, trialDaysLeft }) => {
  const banner = statusBanner(subscription, trialDaysLeft);
  if (!banner) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold ${BANNER_TONE_CLASSES[banner.tone]}`}
    >
      {banner.icon === 'clock' ? <Clock className="h-3.5 w-3.5" /> : null}
      {banner.text}
    </span>
  );
};

export default StatusBanner;
