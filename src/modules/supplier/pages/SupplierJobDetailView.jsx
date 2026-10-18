import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import {
  fetchSupplierJobDetails,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";

const SupplierJobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.supplierRecruitment,
  );
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchSupplierJobDetails(jobId)).then((result) => {
      if (fetchSupplierJobDetails.rejected.match(result)) {
        setNotFound(true);
      }
    });
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error && !selectedJobLoading) toast.error(error);
  }, [error, selectedJobLoading]);

  if (notFound) return <NotFound />;

  if (selectedJobLoading || (!selectedJob && !error)) {
    return (
      <PanelPage>
        <JobDetailSkeleton />
      </PanelPage>
    );
  }

  const job = toJobDetailModel(selectedJob);
  if (!job) return <NotFound />;

  return (
    <PanelPage>
      <Link
        to="/supplier/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <JobDetailCard job={job} applyHref={job.applyLink} />
    </PanelPage>
  );
};

export default SupplierJobDetailView;
