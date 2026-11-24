import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchJobDetails,
  clearSelectedJob,
  clearRecruitmentError,
  recruitmentApi,
  jobApplicationsSeen,
  fetchNewApplicationCounts,
} from "@/features/dash/user/recruitment";

/**
 * Loads a job by id. For the owner it also loads the applications and marks
 * them as seen.
 */
export function useJobDetail(jobId) {
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.userRecruitment,
  );
  const authUser = useSelector((state) => state.auth.user);

  const [notFoundId, setNotFoundId] = useState(null);
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchJobDetails(jobId)).then((result) => {
      if (fetchJobDetails.rejected.match(result)) setNotFoundId(jobId);
    });
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error && !selectedJobLoading) toast.error(error);
  }, [error, selectedJobLoading]);

  const isOwner =
    Boolean(authUser?.id) &&
    Boolean(selectedJob?.owner?.id) &&
    authUser.id === selectedJob.owner.id;

  useEffect(() => {
    if (!jobId || !isOwner) return undefined;

    let cancelled = false;
    recruitmentApi
      .getJobApplications(jobId)
      .then((rows) => {
        if (!cancelled) {
          setAppsCache({ key: jobId, rows: Array.isArray(rows) ? rows : [] });
        }
        dispatch(jobApplicationsSeen(jobId));
        dispatch(fetchNewApplicationCounts());
      })
      .catch((err) => {
        if (!cancelled) {
          setAppsCache({ key: jobId, rows: [] });
          toast.error(
            recruitmentApi.getApiErrorMessage?.(err, "Failed to load applications") ||
              "Failed to load applications",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, jobId, isOwner]);

  return {
    selectedJob,
    notFound: notFoundId === jobId,
    loading: selectedJobLoading || (!selectedJob && !error),
    isOwner,
    applications: isOwner && appsCache.key === jobId ? appsCache.rows : [],
    applicationsLoading: isOwner && appsCache.key !== jobId,
  };
}
