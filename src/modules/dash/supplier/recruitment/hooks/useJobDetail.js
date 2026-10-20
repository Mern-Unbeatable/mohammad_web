import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSupplierJobDetails,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
  recruitmentApi,
} from "@/features/dash/supplier/recruitment";

/** Loads a job by id; for the owner it also loads the applications. */
export const useJobDetail = (jobId) => {
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.supplierRecruitment,
  );
  const authUser = useSelector((state) => state.auth.user);
  /** Job id whose fetch was rejected; any other id is not (yet) known to be missing. */
  const [missingId, setMissingId] = useState(null);
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  const isOwner =
    Boolean(authUser?.id) &&
    Boolean(selectedJob?.owner?.id) &&
    selectedJob?.id === jobId &&
    authUser.id === selectedJob.owner.id;

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchSupplierJobDetails(jobId)).then((result) => {
      if (fetchSupplierJobDetails.rejected.match(result)) setMissingId(jobId);
    });
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error && !selectedJobLoading) toast.error(error);
  }, [error, selectedJobLoading]);

  useEffect(() => {
    if (!isOwner || !jobId) return undefined;
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
  }, [isOwner, jobId]);

  const loading = selectedJobLoading || (!selectedJob && !error);
  const applicationsLoaded = appsCache.key === jobId;

  return {
    notFound: Boolean(jobId) && missingId === jobId,
    loading,
    job: loading ? null : toJobDetailModel(selectedJob),
    owner: selectedJob?.owner,
    alreadyApplied: Boolean(selectedJob?.myApplication),
    isOwner,
    applications: applicationsLoaded ? appsCache.rows : [],
    applicationsLoading: !applicationsLoaded,
  };
};
