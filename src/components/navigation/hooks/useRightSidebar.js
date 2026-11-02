import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchSidebarJobs,
  fetchSidebarListings,
  fetchSidebarPeople,
  markSidebarPersonPending,
  requestContactConnection,
} from '@/features/dash/user/rightSidebar';

/** Loads people suggestions, latest listings and jobs with Redux-backed cache. */
export function useRightSidebar() {
  const dispatch = useDispatch();
  const {
    people,
    listings,
    jobs,
    peopleLoading,
    listingsLoading,
    jobsLoading,
    peopleError,
    listingsError,
    jobsError,
  } = useSelector((state) => state.userRightSidebar);
  const [connectingId, setConnectingId] = useState(null);
  const previousLoading = useRef({
    peopleLoading,
    listingsLoading,
    jobsLoading,
  });

  useEffect(() => {
    dispatch(fetchSidebarPeople());
    dispatch(fetchSidebarListings());
    dispatch(fetchSidebarJobs());
  }, [dispatch]);

  useEffect(() => {
    const previous = previousLoading.current;
    if (previous.peopleLoading && !peopleLoading && peopleError) {
      toast.error(peopleError);
    }
    if (previous.listingsLoading && !listingsLoading && listingsError) {
      toast.error(listingsError);
    }
    if (previous.jobsLoading && !jobsLoading && jobsError) {
      toast.error(jobsError);
    }
    previousLoading.current = {
      peopleLoading,
      listingsLoading,
      jobsLoading,
    };
  }, [
    peopleLoading,
    listingsLoading,
    jobsLoading,
    peopleError,
    listingsError,
    jobsError,
  ]);

  const handleConnect = async (person) => {
    if (!person?.id || person.connected || person.pending || connectingId) {
      return;
    }
    setConnectingId(person.id);
    const result = await dispatch(requestContactConnection(person.id));
    setConnectingId(null);

    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
      dispatch(markSidebarPersonPending(person.id));
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
