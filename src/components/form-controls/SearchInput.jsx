import { Search } from 'lucide-react';
import { withClass } from './formStyles';

const SEARCH_VARIANTS = {
  /** Page toolbars (recruitment, marketplace). */
  default: {
    icon: 'left-3.5',
    input:
      'w-full rounded-lg border border-[#E4E7EC] bg-white py-2.5 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10',
  },
  /** Tighter search inside pickers and dialogs. */
  compact: {
    icon: 'left-3',
    input:
      'w-full rounded-lg border border-[#E4E7EC] bg-white py-2.5 pl-9 pr-3 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10',
  },
  /** Grey pill at the top of conversation lists. */
  pill: {
    icon: 'left-3.5',
    input:
      'w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2.5 pl-10 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10',
  },
  /** Large white pill in page heroes. */
  hero: {
    icon: 'left-4',
    input:
      'w-full rounded-full border border-[#E4E7EC] bg-white py-2.5 pl-11 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:py-3 sm:text-[14px]',
  },
};

/** `className` styles the wrapper; `inputClassName` is appended to the input. */
const SearchInput = ({ variant = 'default', className, inputClassName, ...props }) => {
  const preset = SEARCH_VARIANTS[variant] ?? SEARCH_VARIANTS.default;
  return (
    <div className={withClass('relative', className)}>
      <Search
        className={`pointer-events-none absolute ${preset.icon} top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]`}
      />
      <input type="search" {...props} className={withClass(preset.input, inputClassName)} />
    </div>
  );
};

export default SearchInput;
