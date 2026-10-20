import { Link } from 'react-router';
import { Heart, List, Plus, Search } from 'lucide-react';
import { categories } from '@/modules/dash/user/data/marketplace';
import { SEARCH_MAX_LENGTH } from '@/shared/utils/urlFilters';
import {
  CREATE_LISTING_PATH,
  MARKETPLACE_VIEW,
  MY_LISTINGS_PATH,
  SAVED_LISTINGS_PATH,
} from '../../constant/constants';

const actionBtn =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors';

const MarketplaceToolbar = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  activeView = MARKETPLACE_VIEW.BROWSE,
}) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">Marketplace</h1>
        <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
          Second-hand laboratory equipment from verified members.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to={SAVED_LISTINGS_PATH}
          className={`${actionBtn} ${
            activeView === MARKETPLACE_VIEW.SAVED
              ? 'bg-pink-secondary text-pink-light'
              : 'border border-pink-light/30 text-pink-light hover:bg-pink-secondary'
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          Saved Listing
        </Link>
        <Link
          to={MY_LISTINGS_PATH}
          className={`${actionBtn} ${
            activeView === MARKETPLACE_VIEW.MINE
              ? 'bg-green-secondary text-green-primary'
              : 'border border-green-primary/30 text-green-primary hover:bg-green-secondary'
          }`}
        >
          <List className="h-3.5 w-3.5" />
          My Listing
        </Link>
        <Link
          to={CREATE_LISTING_PATH}
          className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}
        >
          <Plus className="h-3.5 w-3.5" />
          Create Listing
        </Link>
      </div>
    </div>

    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        maxLength={SEARCH_MAX_LENGTH}
        placeholder="Search equipment, category or location..."
        className="w-full rounded-lg border border-[#E4E7EC] bg-white py-2.5 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>

    <div className="flex flex-wrap gap-2">
      {categories.map((item) => {
        const isActive = category === item;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={isActive}
            onClick={() => onCategoryChange(item)}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              isActive
                ? 'bg-[#E67E22] text-white'
                : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

export default MarketplaceToolbar;
