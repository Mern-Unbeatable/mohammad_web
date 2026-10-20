import { ChevronDown } from "lucide-react";

/** `options[0]` is the "All" value, shown as `allLabel`. */
const FilterSelect = ({ label, allLabel, options, value, onChange }) => (
  <div className="relative min-w-0 flex-1 sm:w-[160px] sm:flex-none">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full cursor-pointer appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-9 text-[13px] font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
        value === options[0]
          ? "border-[#E4E7EC] text-[#475467]"
          : "border-primary/40 text-primary"
      }`}
    >
      {options.map((option, index) => (
        <option key={option} value={option}>
          {index === 0 ? allLabel : option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
  </div>
);

export default FilterSelect;
