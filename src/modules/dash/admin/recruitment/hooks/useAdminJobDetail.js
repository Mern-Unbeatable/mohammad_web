import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  clearSelectedJob,
  fetchJobDetails,
  recruitmentApi,
  toJobCardModel,
} from "@/features/dash/admin/recruitment";

/**
 * Job from the route (cleared on leave) and its applications. Applications are
 * cached per job id, so a stale list never shows for another job; a failed
 * request shows an empty list.
 */
export const useAdminJobDetail = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.adminRecruitment,
  );
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  useEffect(() => {
    if (jobId) dispatch(fetchJobDetails(jobId));
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (!jobId) return undefined;
    let cancelled = false;
    recruitmentApi
      .getJobApplications(jobId)
      .then((rows) => {
        if (!cancelled) setAppsCache({ key: jobId, rows });
      })
      .catch(() => {
        if (!cancelled) setAppsCache({ key: jobId, rows: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const job = useMemo(() => toJobCardModel(selectedJob), [selectedJob]);
  const applicationsLoaded = appsCache.key === jobId;

  return {
    loading: selectedJobLoading,
    notFound: (error && !selectedJob) || !job,
    job,
    owner: selectedJob?.owner,
    applications: applicationsLoaded ? appsCache.rows : [],
    applicationsLoading: !applicationsLoaded,
  };
};
