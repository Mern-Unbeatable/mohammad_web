import Avatar from "@/components/ui/Avatar";
import { SEARCH_TILE_STYLES, SEARCH_TYPE_ICONS } from "../../constant/constants";
import { searchResultDisplay, searchResultHref } from "../../utils/searchResults";

/** One result: avatar (people, posts) or a type tile, title and details. */
const SearchResultRow = ({ item, type, onSelect }) => {
  const Icon = SEARCH_TYPE_ICONS[type];
  const { title, subtitle, avatar } = searchResultDisplay(item, type);
  return (
    <button
      type="button"
      onClick={() => onSelect(searchResultHref(item, type))}
      className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-[#F9FAFB]"
    >
      {avatar ? (
        <Avatar src={avatar.src} alt={avatar.name} initials={avatar.initials} size="sm" />
      ) : (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            SEARCH_TILE_STYLES[type] || "bg-[#F2F4F7] text-[#475467]"
          }`}
        >
          <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-deep-blue">
          {title}
        </span>
        {subtitle ? (
          <span className="block truncate text-[12px] text-[#64748B]">{subtitle}</span>
        ) : null}
      </span>
    </button>
  );
};

export default SearchResultRow;
