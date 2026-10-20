import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { contactsApi, requestContactConnection } from '@/features/dash/user/contacts';
import { marketplaceApi } from '@/features/dash/user/marketplace';
import { recruitmentApi } from '@/features/dash/user/recruitment';
import { PEOPLE_FETCH_SIZE, SIDEBAR_LIMIT } from '../constant/constants';
import {
  markPending,
  toSidebarJobs,
  toSidebarListings,
  toSuggestedPeople,
} from '../utils/sidebarModels';

/** Loads people suggestions, latest listings and jobs once; handles Connect. */
export function useRightSidebar() {
  const dispatch = useDispatch();
  const [people, setPeople] = useState([]);
  const [listings, setListings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPeople = async () => {
      setPeopleLoading(true);
      try {
        const result = await contactsApi.getContactsList({
          page: 1,
          pageSize: PEOPLE_FETCH_SIZE,
          sort: 'desc',
        });
        if (cancelled) return;
        setPeople(toSuggestedPeople(result.data));
      } catch (err) {
        if (!cancelled) {
          toast.error(contactsApi.getApiErrorMessage(err, 'Failed to load suggestions'));
        }
      } finally {
        if (!cancelled) setPeopleLoading(false);
      }
    };

    const loadListings = async () => {
      setListingsLoading(true);
      try {
        const result = await marketplaceApi.getListingsList({
          page: 1,
          pageSize: SIDEBAR_LIMIT,
          sort: 'desc',
        });
        if (cancelled) return;
        setListings(toSidebarListings(result.data));
      } catch (err) {
        if (!cancelled) {
          toast.error(marketplaceApi.getApiErrorMessage(err, 'Failed to load marketplace'));
        }
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    };

    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const result = await recruitmentApi.getJobsList({
          page: 1,
          pageSize: SIDEBAR_LIMIT,
          sort: 'desc',
        });
        if (cancelled) return;
        setJobs(toSidebarJobs(result.data));
      } catch (err) {
        if (!cancelled) {
          toast.error(recruitmentApi.getApiErrorMessage(err, 'Failed to load jobs'));
        }
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };

    loadPeople();
    loadListings();
    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleConnect = async (person) => {
    if (!person?.id || person.connected || person.pending || connectingId) {
      return;
    }
    setConnectingId(person.id);
    const result = await dispatch(requestContactConnection(person.id));
    setConnectingId(null);

    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
      setPeople((prev) => markPending(prev, person.id));
      return;
    }
    toast.error(result.payload || 'Failed to send connection request');
  };

  return {
    people,
    listings,
    jobs,
    peopleLoading,
    listingsLoading,
    jobsLoading,
    connectingId,
    handleConnect,
  };
}
