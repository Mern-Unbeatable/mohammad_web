import { Search } from "lucide-react";
import SearchDropdown from "./SearchDropdown";

/** Search input + results dropdown; the mobile and desktop headers style it differently. */
const NavSearchField = ({
  containerRef,
  className,
  iconClassName,
  inputClassName,
  placeholder,
  field,
  dropdown,
}) => (
  <div ref={containerRef} className={className}>
    <Search className={iconClassName} />
    <input
      type="search"
      value={field.query}
      onChange={(e) => field.onChange(e.target.value)}
      onKeyDown={field.onKeyDown}
      onFocus={field.onFocus}
      placeholder={placeholder}
      aria-label="Search professionals, products, jobs"
      className={inputClassName}
    />
    <SearchDropdown {...dropdown} />
  </div>
);

export default NavSearchField;
