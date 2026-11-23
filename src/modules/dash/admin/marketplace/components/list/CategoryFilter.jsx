import { MARKETPLACE_CATEGORY_OPTIONS } from "@/features/dash/admin/marketplace";

/** Category pills; the active one is filled. */
const CategoryFilter = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {MARKETPLACE_CATEGORY_OPTIONS.map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => onChange(item)}
        className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
          value === item
            ? "bg-[#E67E22] text-white"
            : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue"
        }`}
      >
        {item}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
