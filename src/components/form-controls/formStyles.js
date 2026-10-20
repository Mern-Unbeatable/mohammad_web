/**
 * Class presets for the text-like controls (Input, Textarea, Select).
 * Each variant is one look that already existed in the app; pick the one the
 * surrounding form uses instead of copying the class string.
 */
export const FIELD_VARIANTS = {
  /** Dashboard panels, dialogs and listing forms. */
  default:
    'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10',
  /** Login, register and password-recovery screens. */
  auth: 'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-gray-100',
  /** Admin editors (blog editor, moderation reasons). */
  editor:
    'w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15',
  /** Job post form: stronger hover and focus feedback. */
  prominent:
    'w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] hover:border-[#98A2B3] focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-[#F9FAFB]',
  /** Admin platform settings. */
  settings:
    'w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 lg:text-[15px]',
  /** Small inline selects (chart period pickers). */
  compact:
    'h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-deep-blue outline-none focus:border-primary',
};

export const LABEL_VARIANTS = {
  default: 'mb-1.5 block text-[13px] font-semibold text-deep-blue',
  auth: 'mb-1.5 block text-base font-medium text-deep-blue',
  editor: 'mb-1.5 block text-[14px] font-medium text-deep-blue',
};

export const HINT_CLASS = 'mt-1.5 text-[12px] text-[#64748B]';

export const ERROR_CLASS =
  'mt-2 flex items-start gap-1.5 text-[13px] text-[#CC1016]';

export const CHECKBOX_CLASS =
  'h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary/20';

/** Joins a preset with caller classes, keeping the preset first. */
export const withClass = (base, className) =>
  className ? `${base} ${className}` : base;

export const fieldClass = (variant = 'default', className) =>
  withClass(FIELD_VARIANTS[variant] ?? FIELD_VARIANTS.default, className);

export const labelClass = (variant = 'default', className) =>
  withClass(LABEL_VARIANTS[variant] ?? LABEL_VARIANTS.default, className);
