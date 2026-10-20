import { useMemo } from 'react';
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs';
import CountBadge from '@/components/ui/CountBadge';
import { COUNTRY_OPTIONS } from '@/features/dash/user/contacts';
import { SEARCH_MAX_LENGTH } from '@/shared/utils/urlFilters';
import { FILTER, FILTER_TABS } from '../../constant/constants';
import { requestsToConfirmLabel } from '../../utils/contactsLabels';

/** Filter tabs (with the Confirm count), search box and country select. */
const DirectoryFilters = ({
  filter,
  onFilterChange,
  pendingRequests,
  query,
  onQueryChange,
  country,
  onCountryChange,
}) => {
  const tabs = useMemo(
    () =>
      FILTER_TABS.map((tab) => ({
        id: tab.id,
        label: (
          <span className="inline-flex items-center gap-1.5">
            <tab.Icon aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />
            {tab.label}
            {tab.id === FILTER.REQUESTS && pendingRequests > 0 && (
              <CountBadge count={pendingRequests} label={requestsToConfirmLabel(pendingRequests)} />
            )}
          </span>
        ),
      })),
    [pendingRequests],
  );

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row-reverse lg:items-center lg:justify-between">
      <SegmentedTabs
        tabs={tabs}
        activeTab={filter}
        onTabChange={onFilterChange}
        standalone
        ariaLabel="Filter contacts"
        className="border border-[#E4E7EC]"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-1">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          maxLength={SEARCH_MAX_LENGTH}
          placeholder="Search by name, laboratory or position..."
          className="w-full min-w-0 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] sm:max-w-[440px] sm:flex-1 lg:max-w-none text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          aria-label="Filter by country"
          className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[180px]"
        >
          {COUNTRY_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DirectoryFilters;
