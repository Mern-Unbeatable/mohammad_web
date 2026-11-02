import { Check, Copy, Mail } from 'lucide-react';

/** Support address as a mailto link with a copy button. */
const SupportEmailCard = ({ email, copied, onCopy }) => (
  <div className="rounded-lg border border-[#E4E7EC] p-4">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Mail className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-[#64748B]">Email</p>
        <a
          href={`mailto:${email}`}
          className="mt-0.5 block break-all text-[15px] font-semibold text-deep-blue hover:text-primary"
        >
          {email}
        </a>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy support email"
        className="shrink-0 rounded-md p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-green-primary" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export default SupportEmailCard;
