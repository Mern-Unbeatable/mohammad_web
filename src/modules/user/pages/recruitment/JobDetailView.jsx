import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import { JobDetailSkeleton } from '@/components/common/Skeleton';
import JobDetailCard from '@/components/data-display/JobDetailCard/JobDetailCard';
import {
  fetchJobDetails,
  applyToJob,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
  recruitmentApi,
  formatPostedAgo,
} from '@/features/user/recruitment';
import NotFound from '@/shared/pages/NotFound';

const JobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, applying, error } = useSelector(
    (state) => state.userRecruitment,
  );
  const authUser = useSelector((state) => state.auth.user);

  const [notFoundId, setNotFoundId] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchJobDetails(jobId)).then((result) => {
      if (fetchJobDetails.rejected.match(result)) {
        setNotFoundId(jobId);
      }
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
          setAppsCache({
            key: jobId,
            rows: Array.isArray(rows) ? rows : [],
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setAppsCache({ key: jobId, rows: [] });
          toast.error(
            recruitmentApi.getApiErrorMessage?.(err, 'Failed to load applications') ||
              'Failed to load applications',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, isOwner]);

  if (notFoundId === jobId) return <NotFound />;

  if (selectedJobLoading || (!selectedJob && !error)) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container className="max-w-[760px]">
          <JobDetailSkeleton />
        </Container>
      </main>
    );
  }

  const job = toJobDetailModel(selectedJob);
  if (!job) return <NotFound />;

  const handleApplyClick = () => {
    setShowApplyForm(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (applying) return;

    const result = await dispatch(
      applyToJob({
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
      }),
    );

    if (applyToJob.fulfilled.match(result)) {
      toast.success('Application submitted');
      setShowApplyForm(false);
      setCoverLetter('');
      return;
    }
    toast.error(result.payload || 'Failed to apply to job');
  };

  const applications = isOwner && appsCache.key === jobId ? appsCache.rows : [];
  const showApplicationsLoading = isOwner && appsCache.key !== jobId;

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-[760px]">
        <Link
          to="/recruitment"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <JobDetailCard
          job={job}
          applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
          onApply={!isOwner && !job.applyLink ? handleApplyClick : undefined}
          showApplyButton={!isOwner}
        />

        {!isOwner && showApplyForm ? (
          <Card className="mt-5">
            <form onSubmit={handleApplySubmit} className="space-y-4 p-5 sm:p-6">
              <div>
                <h2 className="text-[16px] font-bold text-deep-blue">
                  Apply for this position
                </h2>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  Optionally include a short cover letter with your application.
                </p>
              </div>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Cover letter (optional)"
                className="w-full resize-y rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
                >
                  {applying ? 'Submitting…' : 'Submit application'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(false);
                    setCoverLetter('');
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] px-5 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        ) : null}

        {isOwner ? (
          <section className="mt-8">
            <h2 className="text-[18px] font-bold text-deep-blue">Applications</h2>
            <p className="mt-1 text-[13px] text-[#64748B]">
              Candidates who applied to this role.
            </p>

            {showApplicationsLoading ? (
              <div className="mt-4 flex h-28 items-center justify-center rounded-xl bg-white shadow-sm">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                <span className="text-[14px] text-[#64748B]">Loading applications…</span>
              </div>
            ) : applications.length ? (
              <div className="mt-4 space-y-3">
                {applications.map((app) => {
                  const applicant = app.applicant || {};
                  const name =
                    applicant.name ||
                    [applicant.firstName, applicant.lastName]
                      .filter(Boolean)
                      .join(' ') ||
                    applicant.email ||
                    'Applicant';
                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-[#E4E7EC] bg-white px-5 py-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold text-deep-blue">
                            {name}
                          </p>
                          <p className="mt-0.5 text-[13px] text-[#64748B]">
                            {[applicant.title, applicant.company]
                              .filter(Boolean)
                              .join(' · ') || applicant.email || '—'}
                          </p>
                          {app.coverLetter ? (
                            <p className="mt-2 text-[13px] leading-relaxed text-[#475467]">
                              {app.coverLetter}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                          <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                            {app.status || 'PENDING'}
                          </span>
                          <span className="text-[11px] text-[#98A2B3]">
                            {formatPostedAgo(app.appliedAt || app.createdAt).replace(
                              /^Posted /,
                              'Applied ',
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
                <p className="text-[14px] text-[#64748B]">
                  No applications yet.
                </p>
              </div>
            )}
          </section>
        ) : null}
      </Container>
    </main>
  );
};

export default JobDetailView;
