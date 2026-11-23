const contactButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors';

/** Seller contact link; a greyed-out disabled button when the seller has no such detail. */
const ContactLinkButton = ({ href, icon, label, unavailableLabel, external, className }) =>
  href ? (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${contactButtonClass} ${className}`}
    >
      {icon}
      {label}
    </a>
  ) : (
    <button
      type="button"
      disabled
      title={unavailableLabel}
      aria-label={`${label}: ${unavailableLabel}`}
      className={`${contactButtonClass} cursor-not-allowed border-[#E4E7EC] bg-[#F2F4F7] text-[#98A2B3]`}
    >
      {icon}
      {label}
    </button>
  );

export default ContactLinkButton;
