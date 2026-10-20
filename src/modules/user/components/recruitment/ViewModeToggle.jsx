import { LayoutGrid, List } from "lucide-react";
import { VIEW_MODE } from "./viewMode";

const OPTIONS = [
  { value: VIEW_MODE.LIST, label: "List view", Icon: List },
  { value: VIEW_MODE.GRID, label: "Grid view", Icon: LayoutGrid },
];

const ViewModeToggle = ({ value, onChange, className = "" }) => (
  <div
    role="radiogroup"
    aria-label="Layout"
    className={`inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#E4E7EC] bg-white p-1 ${className}`}
  >
    {OPTIONS.map((option) => {
      const active = value === option.value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={active}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
            active
              ? "bg-primary text-white"
              : "text-[#64748B] hover:bg-[#F2F4F7] hover:text-deep-blue"
          }`}
        >
          <option.Icon className="h-4 w-4" />
        </button>
      );
    })}
  </div>
);

export default ViewModeToggle;
