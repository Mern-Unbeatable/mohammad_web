import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchConversations } from '@/features/messages';
import { SEARCH_DEBOUNCE_MS } from '../constant/constants';

/** Debounced conversation search; refetches page 1 when `type` or the term changes. */
export function useConversationSearch(type) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(fetchConversations({ type, search, page: 1 }));
  }, [dispatch, type, search]);

  const clearSearch = () => {
    setQuery('');
    setSearch('');
  };

  return { query, setQuery, search, clearSearch };
}
