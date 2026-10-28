import { Link } from 'react-router';
import { Check } from 'lucide-react';
import { PROFILE_PATH } from '../../constant/constants';

/** Right half of the plan card: included features and help link. */
const PlanFeaturesPanel = ({ features, membershipEnded, showHelp = true }) => (
  <div className="bg-secondary p-6 sm:p-8">
    <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
      Everything Included
    </h2>
    <ul className="mt-4 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-primary" strokeWidth={2.5} />
          <span className="text-[13px] leading-snug text-[#475467]">{feature}</span>
        </li>
      ))}
    </ul>

    {membershipEnded ? (
      <p className="mt-6 text-[13px] text-[#64748B]">
        Your previous membership has ended. Choose a plan above to restore full access.
      </p>
    ) : null}

    {showHelp ? (
      <p className="mt-6 text-[12px] text-[#98A2B3]">
        Need help?{' '}
        <Link to={PROFILE_PATH} className="text-primary hover:underline">
          View subscription details on your profile
        </Link>
      </p>
    ) : null}
  </div>
);

export default PlanFeaturesPanel;
