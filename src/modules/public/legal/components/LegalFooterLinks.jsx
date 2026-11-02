import { Link } from 'react-router';
import { ArrowRight, Mail } from 'lucide-react';
import { SUPPORT_CONTACT } from '@/shared/constants/support';

/** "Also read" link to the other legal page and the support email. */
const LegalFooterLinks = ({ related }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <Link
      to={related.to}
      className="group flex items-center justify-between gap-3 rounded-xl bg-white p-5 transition-colors hover:bg-secondary"
    >
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#64748B]">
          Also read
        </p>
        <p className="mt-0.5 text-[15px] font-semibold text-deep-blue">
          {related.label}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
    </Link>
    <a
      href={`mailto:${SUPPORT_CONTACT.email}`}
      className="flex items-center gap-3 rounded-xl bg-white p-5 transition-colors hover:bg-secondary"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Mail className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#64748B]">
          Questions?
        </p>
        <p className="mt-0.5 break-all text-[15px] font-semibold text-deep-blue">
          {SUPPORT_CONTACT.email}
        </p>
      </div>
    </a>
  </div>
);

export default LegalFooterLinks;
