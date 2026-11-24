import { SearchInput } from "@/components/form-controls";
import { TYPE_OPTIONS } from "../../constant/constants";
import { countLabel } from "../../utils/moderation";

/** Search box, All / Direct / Groups switch and the total count. */
const ConversationFilters = ({ query, onQueryChange, type, onTypeChange, total }) => (
  <div className="shrink-0 space-y-3 border-b border-[#E4E7EC] p-4">
    <SearchInput
      variant="pill"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search by member or group name..."
    />
    <div className="flex gap-1 rounded-xl bg-[#F3F4F6] p-1">
      {TYPE_OPTIONS.map((option) => (
        <button
          key={option.id || "all"}
          type="button"
          onClick={() => onTypeChange(option.id)}
          className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold ${
            type === option.id ? "bg-white text-primary shadow-sm" : "text-[#64748B]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
    <p className="text-[12px] text-[#64748B]">{countLabel(total, "conversation")}</p>
  </div>
);

export default ConversationFilters;
