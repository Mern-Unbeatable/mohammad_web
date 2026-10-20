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
import ViewModeToggle from "@/modules/user/components/recruitment/ViewModeToggle";
import { VIEW_MODE, useViewMode } from "@/modules/user/components/recruitment/viewMode";
import { jobCount } from "@/modules/user/components/recruitment/jobsSection";
import {
  fetchJobs,
  clearRecruitmentError,
  invalidateJobsList,
  levelToApi,
  employmentToApi,
  toJobCardModel,
  selectNewApplicationTotal,
} from "@/features/user/recruitment";
import { usePageParam } from "@/shared/hooks/usePageParam";
import { workplaceToApi } from "@/shared/constants/jobWorkplace";
import { SEARCH_PARAM } from "@/shared/utils/urlFilters";
import {
  ALL_OPTION,
  EMPLOYMENT_FILTER_OPTIONS,
  EMPLOYMENT_PARAM,
  LEVEL_PARAM,
  WORKPLACE_FILTER_OPTIONS,
  WORKPLACE_PARAM,
  publicJobFilters,
} from "./recruitmentUrlFilters";

const JOB_BASE = "/recruitment";
const VIEW_MODE_STORAGE_KEY = "recruitment.publicJobs.viewMode";
const JOBS_PAGE_SIZE = 6;

const buildJobsQuery = ({ page, query, level, employmentType, workplaceType }) => {
  const params = {
    page,
    pageSize: JOBS_PAGE_SIZE,
    sort: "desc",
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  if (employmentType !== ALL_OPTION) params.employmentType = employmentToApi(employmentType);
  if (workplaceType !== ALL_OPTION) params.workplaceType = workplaceToApi(workplaceType);
  return params;
};

const RecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, jobsError, error } = useSelector(
    (state) => state.userRecruitment,
  );
  const newApplications = useSelector(selectNewApplicationTotal);

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    [LEVEL_PARAM]: level,
    [EMPLOYMENT_PARAM]: employmentType,
    [WORKPLACE_PARAM]: workplaceType,
    [SEARCH_PARAM]: search,
  } = publicJobFilters.read(searchParams);
  const [page, setPage] = usePageParam();
  const [viewMode, setViewMode] = useViewMode(VIEW_MODE_STORAGE_KEY);
  const isGrid = viewMode === VIEW_MODE.GRID;
  const listClassName = isGrid
    ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    : "space-y-4";

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
      setSearchParams((prev) => publicJobFilters.apply(prev, changes), { replace });
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    const next = publicJobFilters.normalize(searchParams);
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
    dispatch(
      fetchJobs(
        buildJobsQuery({ page, query: search, level, employmentType, workplaceType }),
      ),
    );
  }, [dispatch, page, search, level, employmentType, workplaceType]);

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

  const handleEmploymentTypeChange = (value) => {
    if (value === employmentType) return;
    updateFilters({ [EMPLOYMENT_PARAM]: value });
  };

  const handleWorkplaceTypeChange = (value) => {
    if (value === workplaceType) return;
    updateFilters({ [WORKPLACE_PARAM]: value });
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    setPage(next);
  };

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          newApplications={newApplications}
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={handleLevelChange}
          employmentType={employmentType}
          employmentOptions={EMPLOYMENT_FILTER_OPTIONS}
          onEmploymentTypeChange={handleEmploymentTypeChange}
          workplaceType={workplaceType}
          workplaceOptions={WORKPLACE_FILTER_OPTIONS}
          onWorkplaceTypeChange={handleWorkplaceTypeChange}
          activeView="browse"
          basePath={JOB_BASE}
        />

        <div className="mt-6">
          <JobsSectionHeader
            title="Public Job Posts"
            description="Open roles posted by other members of the network."
            count={jobsError ? null : jobCount(showSkeleton, jobsMeta?.total)}
          >
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </JobsSectionHeader>
        </div>

        <div className="mt-4">
          {showSkeleton ? (
            <CardSkeleton
              variant={isGrid ? "jobGrid" : "job"}
              count={JOBS_PAGE_SIZE}
              className={listClassName}
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
            <div className={listClassName}>
              {pageItems.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  layout={viewMode}
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
                Try a different search or filter.
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
