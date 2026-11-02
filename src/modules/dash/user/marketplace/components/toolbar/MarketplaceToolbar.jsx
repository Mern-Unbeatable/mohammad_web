import { Link } from 'react-router';
import { Globe, Heart, List, Plus } from 'lucide-react';
import ScrollRow from '@/components/common/scrolls/ScrollRow';
import { SearchInput } from '@/components/form-controls';
import { categories } from '@/modules/dash/user/data/marketplace';
import { SEARCH_MAX_LENGTH } from '@/shared/utils/urlFilters';
import {
  CREATE_LISTING_PATH,
  MARKETPLACE_PATH,
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
          to={MARKETPLACE_PATH}
          aria-current={activeView === MARKETPLACE_VIEW.BROWSE ? 'page' : undefined}
          className={`${actionBtn} ${
            activeView === MARKETPLACE_VIEW.BROWSE
              ? 'bg-secondary text-primary'
              : 'border border-primary/30 text-primary hover:bg-secondary'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Public Listing
        </Link>
        <Link
          to={SAVED_LISTINGS_PATH}
          aria-current={activeView === MARKETPLACE_VIEW.SAVED ? 'page' : undefined}
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
          aria-current={activeView === MARKETPLACE_VIEW.MINE ? 'page' : undefined}
          className={`${actionBtn} ${
            activeView === MARKETPLACE_VIEW.MINE
              ? 'bg-green-secondary text-green-primary'
              : 'border border-green-primary/30 text-green-primary hover:bg-green-secondary'
          }`}
        >
          <List className="h-3.5 w-3.5" />
          My Listing
        </Link>
      </div>
    </div>

    <SearchInput
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      maxLength={SEARCH_MAX_LENGTH}
      placeholder="Search equipment, category or location..."
    />

    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <ScrollRow
        ariaLabel="Filter by category"
        className="snap-x gap-2 px-0.5 py-0.5 sm:flex-wrap sm:overflow-visible"
      >
        {categories.map((item) => {
          const isActive = category === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={isActive}
              onClick={(event) => {
                event.currentTarget.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center',
                });
                onCategoryChange(item);
              }}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                isActive
                  ? 'bg-[#E67E22] text-white'
                  : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue'
              }`}
            >
              {item}
            </button>
          );
        })}
      </ScrollRow>

      {activeView === MARKETPLACE_VIEW.MINE && (
        <Link
          to={CREATE_LISTING_PATH}
          className={`${actionBtn} shrink-0 self-end bg-primary sm:self-start text-white hover:bg-[#066BB0]`}
        >
          <Plus className="h-3.5 w-3.5" />
          Create Listing
        </Link>
      )}
    </div>
  </div>
);

export default MarketplaceToolbar;
