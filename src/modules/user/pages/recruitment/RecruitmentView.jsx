import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import Container from "@/components/ui/Container";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import JobsSectionHeader from "@/modules/user/components/recruitment/JobsSectionHeader";
import { jobCount } from "@/modules/user/components/recruitment/jobsSection";
import {
  fetchJobs,
  clearRecruitmentError,
  invalidateJobsList,
  levelToApi,
  toJobCardModel,
} from "@/features/user/recruitment";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";
import { usePageParam } from "@/shared/hooks/usePageParam";
import { SEARCH_PARAM } from "@/shared/utils/urlFilters";
import { LEVEL_PARAM, recruitmentFilters } from "./recruitmentUrlFilters";

const JOB_BASE = "/recruitment";

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

const RecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, jobsError, error } = useSelector(
    (state) => state.userRecruitment,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { [LEVEL_PARAM]: level, [SEARCH_PARAM]: search } =
    recruitmentFilters.read(searchParams);
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      dispatch(invalidateJobsList());
      setSearchParams((prev) => recruitmentFilters.apply(prev, changes), { replace });
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    const next = recruitmentFilters.normalize(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : "";
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const loadJobs = useCallback(() => {
    dispatch(clearRecruitmentError());
    dispatch(fetchJobs(buildJobsQuery({ page, query: search, level })));
  }, [dispatch, page, search, level]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !jobsLoading &&
    !jobsError &&
    Number(jobsMeta?.page) === page &&
    page > totalPages;
  const showSkeleton = jobsLoading || pageOutOfRange;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const handleLevelChange = (value) => {
    if (value === level) return;
    updateFilters({ [LEVEL_PARAM]: value });
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    setPage(next);
  };

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={handleLevelChange}
          activeView="browse"
          basePath={JOB_BASE}
        />

        <div className="mt-6">
          <JobsSectionHeader
            title="Public Job Posts"
            description="Open roles posted by other members of the network."
            count={jobsError ? null : jobCount(showSkeleton, jobsMeta?.total)}
          />
        </div>

        <div className="mt-4 space-y-4">
          {showSkeleton ? (
            <CardSkeleton
              variant="job"
              count={LIST_PAGE_SIZE}
              className="space-y-4"
            />
          ) : jobsError ? (
            <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                Couldn&apos;t load jobs
              </p>
              <button
                type="button"
                onClick={loadJobs}
                className="mt-2 text-[14px] font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : pageItems.length ? (
            pageItems.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                highlighted={index === 0 && page === 1}
                detailHref={`${JOB_BASE}/${job.id}`}
              />
            ))
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
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      </Container>
    </main>
  );
};

export default RecruitmentView;
