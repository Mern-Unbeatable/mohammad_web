import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/common/Pagination/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { CardSkeleton } from "@/components/common/Skeleton";
import JobCard from "@/components/data-display/JobCard/JobCard";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  fetchJobsList,
  removeJob,
} from "@/features/admin/recruitment";
import {
  RECRUITMENT_LEVEL_OPTIONS,
  RECRUITMENT_TIME_OPTIONS,
  levelToApi,
  timeToApi,
  toJobCardModel,
} from "@/features/admin/recruitment/recruitmentMappers";

const PAGE_SIZE = 10;

const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="relative inline-flex w-full min-w-0 sm:min-w-[140px] sm:w-auto">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-2 pl-3 pr-9 text-sm text-deep-blue outline-none transition-colors hover:border-[#D0D5DD] focus:border-primary"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
  </label>
);

const buildJobsQuery = ({ page, timeFilter, level }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
  };

  const since = timeToApi(timeFilter);
  if (since) params.since = since;

  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;

  return params;
};

const AdminRecruitmentView = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, deleting, error } = useSelector(
    (state) => state.adminRecruitment,
  );

  const [timeFilter, setTimeFilter] = useState("All Time");
  const [level, setLevel] = useState("All");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [timeFilter, level]);

  useEffect(() => {
    dispatch(fetchJobsList(buildJobsQuery({ page, timeFilter, level })));
  }, [dispatch, page, timeFilter, level]);

  const pageItems = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const handleDeleteRequest = (jobId) => {
    if (deleting) return;
    const job = pageItems.find((item) => item.id === jobId);
    if (!job) return;
    setPendingDelete(job);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeJob(pendingDelete.id));
    if (removeJob.fulfilled.match(result)) {
      toast.success("Job deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete job");
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Manage job listings, approvals and applications."
        action={
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <FilterSelect
              label="Time filter"
              value={timeFilter}
              options={RECRUITMENT_TIME_OPTIONS}
              onChange={setTimeFilter}
            />
            <FilterSelect
              label="Level filter"
              value={level}
              options={RECRUITMENT_LEVEL_OPTIONS}
              onChange={setLevel}
            />
          </div>
        }
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {jobsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="job"
          count={5}
          className="space-y-3"
        />
      ) : pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#64748B]">
          No job listings found for these filters.
        </p>
      ) : (
        <div className="space-y-3">
          {pageItems.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              variant="admin"
              detailHref={`/admin/recruitment/${job.id}`}
              onDelete={deleting ? undefined : handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <Pagination
        page={jobsMeta?.page || page}
        totalPages={jobsMeta?.totalPages || 1}
        onPageChange={setPage}
        className="mt-2"
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete job post?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this job"}
              </span>
              {pendingDelete.company ? (
                <>
                  {" "}
                  at{" "}
                  <span className="font-semibold text-deep-blue">
                    {pendingDelete.company}
                  </span>
                </>
              ) : null}
              . This action cannot be undone.
            </p>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </PanelPage>
  );
};

export default AdminRecruitmentView;
