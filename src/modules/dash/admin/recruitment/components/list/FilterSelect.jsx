import { ChevronDown } from "lucide-react";

/** Native select with a chevron; `label` is screen-reader only. */
const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="relative inline-flex w-full min-w-0 sm:min-w-[140px] sm:w-auto">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-2 pl-3 pr-9 text-sm text-deep-blue outline-none transition-colors hover:border-[#D0D5DD] focus:border-primary"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
  </label>
);

export default FilterSelect;
