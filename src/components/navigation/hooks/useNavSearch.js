import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  DEFAULT_SEARCH_TAB,
  SEARCH_PATH,
  buildSearchPath,
  toSearchGroups,
} from '@/modules/user/pages/search';
import {
  clearSearchError,
  clearSearchResults,
  fetchGlobalSearch,
  toSearchResultsModel,
} from '@/features/user/search';
import { SEARCH_DEBOUNCE_MS, SEARCH_FETCH_LIMIT } from '../constant/constants';

/**
 * Navbar search shared by the mobile and desktop inputs: debounced global
 * search, a results dropdown that closes on outside clicks, and Enter / "See
 * all" opening the /search page. The input mirrors /search's `?q=`.
 */
export function useNavSearch() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const urlQuery = pathname === SEARCH_PATH ? (searchParams.get('q') ?? '') : null;
  const [query, setQuery] = useState(urlQuery ?? '');
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_SEARCH_TAB);
  const mobileSearchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  // Mirror the /search page's ?q= into the input; clear it when leaving that page.
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setQuery(urlQuery ?? '');
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.userSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      dispatch(clearSearchResults());
      return;
    }
    dispatch(clearSearchError());
    dispatch(fetchGlobalSearch({ q: debouncedQuery, limit: SEARCH_FETCH_LIMIT }));
  }, [dispatch, debouncedQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const inMobile = mobileSearchRef.current?.contains(event.target);
      const inDesktop = desktopSearchRef.current?.contains(event.target);
      if (!inMobile && !inDesktop) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const model = useMemo(() => toSearchResultsModel(results), [results]);
  const groups = useMemo(() => toSearchGroups(model), [model]);

  const handleSelect = (href) => {
    setSearchOpen(false);
    setQuery('');
    setActiveTab(DEFAULT_SEARCH_TAB);
    dispatch(clearSearchResults());
    if (href && href !== '#') navigate(href);
  };

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(buildSearchPath(q, activeTab));
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (!query.trim()) return;
    submitSearch();
    e.currentTarget.blur();
  };

  const handleChange = (value) => {
    setQuery(value);
    setSearchOpen(true);
  };

  return {
    mobileSearchRef,
    desktopSearchRef,
    field: {
      query,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onFocus: () => setSearchOpen(true),
    },
    dropdown: {
      open: searchOpen && Boolean(debouncedQuery),
      loading,
      groups,
      activeTab,
      onTabChange: setActiveTab,
      onSelect: handleSelect,
      onSeeAll: submitSearch,
    },
  };
}
