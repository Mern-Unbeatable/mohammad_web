import { panelPageTheme } from "@/components/layout/panelPageTheme";
import { Input } from "@/components/form-controls";

/** Decimal text input with a € suffix. */
const PriceField = ({ id, label, value, onChange }) => (
  <div className="min-w-0">
    <label htmlFor={id} className={`mb-1.5 block ${panelPageTheme.cardBody} font-medium`}>
      {label}
    </label>
    <div className="relative">
      <Input
        variant="settings"
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#64748B]">
        €
      </span>
    </div>
  </div>
);

export default PriceField;
