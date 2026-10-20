import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import JobCard from "@/components/data-display/JobCard/JobCard";
import {
  RecruitmentToolbar,
  JobsSectionHeader,
  jobCount,
} from "@/modules/dash/user/pages/recruitment";
import SupplierRecruitmentActions from "@/modules/dash/supplier/components/SupplierRecruitmentActions";
import {
  fetchSupplierJobs,
  clearRecruitmentError,
  invalidateJobsList,
  levelToApi,
  toJobCardModel,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/supplier/recruitment";

const buildJobsQuery = ({ page, query, level }) => {
  const params = {
    page,
    pageSize: LIST_PAGE_SIZE,
    sort: "desc",
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const SupplierRecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateJobsList());
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildJobsQuery({ page, query: debouncedQuery, level }),
      ),
    );
  }, [dispatch, page, debouncedQuery, level]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);

  const handleLevelChange = (next) => {
    if (next === level) return;
    dispatch(invalidateJobsList());
    setLevel(next);
    setPage(1);
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateJobsList());
    setPage(next);
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Find your next laboratory-industry role or discover qualified candidates."
        action={<SupplierRecruitmentActions activeView="browse" />}
      />

      <RecruitmentToolbar
        query={query}
        onQueryChange={setQuery}
        level={level}
        onLevelChange={handleLevelChange}
        basePath={JOB_BASE}
        showTitle={false}
        showActions={false}
      />

      <JobsSectionHeader
        title="Public Job Posts"
        description="Open roles posted by other members of the network."
        count={jobCount(jobsLoading, jobsMeta?.total)}
      />

      {jobsLoading ? (
        <CardSkeleton
          variant="job"
          count={LIST_PAGE_SIZE}
          className="space-y-4"
        />
      ) : pageItems.length ? (
        <div className="space-y-4">
          {pageItems.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              highlighted={index === 0 && page === 1}
              detailHref={`${JOB_BASE}/${job.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-deep-blue">
            No jobs found
          </p>
          <p className="mt-2 text-[14px] text-[#64748B]">
            Try a different search or level filter.
          </p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierRecruitmentView;
