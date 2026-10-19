import { POST_TYPE_OPTIONS } from "../../utils/postTypeOptions";

const PostTypeChips = ({ value, onChange, disabled }) => (
  <div className="mb-4 flex flex-wrap gap-2">
    {POST_TYPE_OPTIONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        disabled={disabled}
        aria-pressed={value === id}
        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-3.5 sm:text-[12px] ${
          value === id
            ? "border-primary bg-secondary text-primary"
            : "border-[#E4E7EC] text-[#475467] hover:border-primary/40"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default PostTypeChips;
