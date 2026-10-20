import { Search } from "lucide-react";

/** Shown on /search before a query is entered. */
const SearchPrompt = () => (
  <div className="flex flex-col items-center gap-2 pb-6 pt-8 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F3FB] text-primary">
      <Search aria-hidden="true" className="h-6 w-6" />
    </span>
    <p className="text-[14px] font-semibold text-deep-blue">Search Lab Unity</p>
    <p className="max-w-[320px] text-[13px] text-[#64748B]">
      Type in the search bar and press Enter to find people, jobs, blogs and listings.
    </p>
  </div>
);

export default SearchPrompt;
