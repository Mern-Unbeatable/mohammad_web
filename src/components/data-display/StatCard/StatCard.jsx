import {
  Users,
  UserPlus,
  CreditCard,
  DollarSign,
  Briefcase,
  Tag,
  Activity,
  ShieldAlert,
  Megaphone,
  Building2,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const toneStyles = {
  blue: 'bg-secondary text-primary',
  pink: 'bg-pink-secondary text-pink-light',
  green: 'bg-green-secondary text-green-primary',
  orange: 'bg-[#FEF3E8] text-[#E67E22]',
  purple: 'bg-[#F3E8FF] text-[#7C3AED]',
  teal: 'bg-[#E6FFFA] text-[#0D9488]',
};

const iconMap = {
  'active-users': { icon: Users, tone: 'blue' },
  'new-subscribers': { icon: UserPlus, tone: 'pink' },
  'active-subscriptions': { icon: CreditCard, tone: 'purple' },
  'monthly-revenue': { icon: DollarSign, tone: 'green' },
  'new-jobs': { icon: Briefcase, tone: 'orange' },
  'marketplace-listings': { icon: Tag, tone: 'teal' },
  'pending-reports': { icon: ShieldAlert, tone: 'orange' },
  'pending-ads': { icon: Megaphone, tone: 'pink' },
  suppliers: { icon: Building2, tone: 'teal' },
};

const StatCard = ({ id, icon: CustomIcon, label, value, currency, tone, className = '' }) => {
  const iconConfig = iconMap[id] || {};
  const Icon = CustomIcon || iconConfig.icon || Activity;

  // Prefer explicit tone if provided, otherwise fall back to mapped tone for ID, then default to blue
  const activeTone = tone || iconConfig.tone || 'blue';

  const formattedValue =
    currency === 'EUR'
      ? `€${typeof value === 'number' ? value.toFixed(2) : value}`
      : currency === 'USD'
      ? `$${typeof value === 'number' ? value.toFixed(2) : value}`
      : currency
      ? `${currency} ${value}`
      : value;

  return (
    <Card className={`p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            toneStyles[activeTone] || toneStyles.blue
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#64748B] sm:text-[14px] lg:text-[15px]">
            {label}
          </p>
          <p className="mt-1 text-[22px] font-bold leading-none text-deep-blue sm:text-[24px] lg:text-[26px]">
            {formattedValue}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
