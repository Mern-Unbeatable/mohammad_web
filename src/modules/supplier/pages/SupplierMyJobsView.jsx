import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { CardSkeleton } from "@/components/common/Skeleton";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import SupplierRecruitmentActions from "@/modules/supplier/components/SupplierRecruitmentActions";
import {
  fetchSupplierJobs,
  removeSupplierJob,
  clearRecruitmentError,
  invalidateJobsList,
  levelToApi,
  toJobCardModel,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/supplier/recruitment";

const buildMyJobsQuery = ({ query, level }) => {
  const params = {
    page: 1,
    pageSize: 50,
    sort: "desc",
    mine: true,
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const SupplierMyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, jobsLoading, deleting, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateJobsList());
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildMyJobsQuery({ query: debouncedQuery, level }),
      ),
    );
  }, [dispatch, debouncedQuery, level]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const handleLevelChange = (next) => {
    if (next === level) return;
    dispatch(invalidateJobsList());
    setLevel(next);
  };

  const handleDeleteRequest = (id) => {
    if (deleting) return;
    const job = filtered.find((item) => item.id === id);
    if (!job) return;
    setPendingDelete(job);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeSupplierJob(pendingDelete.id));
    if (removeSupplierJob.fulfilled.match(result)) {
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
        subtitle="Find your next laboratory-industry role or discover qualified candidates."
        action={<SupplierRecruitmentActions activeView="mine" />}
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

      {jobsLoading ? (
        <CardSkeleton
          variant="job"
          count={LIST_PAGE_SIZE}
          className="space-y-4"
        />
      ) : (
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                variant="mine"
                highlighted={index === 0}
                detailHref={`${JOB_BASE}/${job.id}`}
                onDelete={deleting ? undefined : handleDeleteRequest}
                onEdit={() => navigate(`${JOB_BASE}/${job.id}`)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                No job posts yet
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Post your first role to reach qualified laboratory professionals.
              </p>
            </div>
          )}
        </div>
      )}

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

export default SupplierMyJobsView;
