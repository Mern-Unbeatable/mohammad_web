import { useEffect, useState } from 'react';
import { DEFAULT_CATEGORY } from '../utils/marketplaceUrlFilters';
import { SEARCH_DEBOUNCE_MS } from '../constant/constants';

/** Search box and category kept in component state (Saved and My listings). */
export const useLocalListingFilters = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, debouncedQuery, category, setCategory };
};
