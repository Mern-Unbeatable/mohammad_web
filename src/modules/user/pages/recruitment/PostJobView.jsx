import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import {
  createJob,
  updateJob,
  formToCreatePayload,
  jobToFormValues,
  EMPLOYMENT_TYPE_OPTIONS,
  RECRUITMENT_LEVEL_OPTIONS,
  recruitmentApi,
} from "@/features/user/recruitment";

const fieldClass =
  "w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-deep-blue";

const LEVEL_OPTIONS = RECRUITMENT_LEVEL_OPTIONS.filter((item) => item !== "All");

const emptyForm = () => ({
  title: "",
  company: "",
  applyLink: "",
  location: "",
  salary: "",
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  level: LEVEL_OPTIONS[1] || LEVEL_OPTIONS[0],
  description: "",
  requirements: "",
});

const PostJobView = () => {
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.userRecruitment);
  const [loadingJob, setLoadingJob] = useState(isEdit);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isEdit) return undefined;

    let cancelled = false;
    setLoadingJob(true);

    (async () => {
      try {
        const job = await recruitmentApi.getJobById(jobId);
        if (cancelled || !job) return;
        setForm(jobToFormValues(job));
      } catch (err) {
        if (!cancelled) {
          toast.error(
            recruitmentApi.getApiErrorMessage(err, "Failed to load job"),
          );
          navigate("/recruitment/my-jobs");
        }
      } finally {
        if (!cancelled) setLoadingJob(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, jobId, navigate]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || loadingJob) return;

    const payload = formToCreatePayload(form);
    if (!payload.title || !payload.company || !payload.location || !payload.about) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!payload.requirements.length) {
      toast.error("Add at least one requirement");
      return;
    }

    const result = isEdit
      ? await dispatch(updateJob({ jobId, payload }))
      : await dispatch(createJob(payload));

    const ok = isEdit
      ? updateJob.fulfilled.match(result)
      : createJob.fulfilled.match(result);

    if (ok) {
      toast.success(isEdit ? "Job updated" : "Job published");
      navigate("/recruitment/my-jobs");
      return;
    }
    toast.error(
      result.payload ||
        (isEdit ? "Failed to update job" : "Failed to publish job"),
    );
  };

  if (loadingJob) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container className="max-w-[760px]">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <span className="text-[14px] font-medium text-[#64748B]">
              Loading job…
            </span>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-[760px]">
        <Link
          to="/recruitment/my-jobs"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to my jobs
        </Link>

        <Card>
          <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
            <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
              {isEdit ? "Edit job" : "Post a Job"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label htmlFor="title" className={labelClass}>
                  Job Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={update("title")}
                  placeholder="e.g. Quality Control Analyst"
                  className={fieldClass}
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="company" className={labelClass}>
                  Company / Laboratory
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={update("company")}
                  placeholder="e.g. EuroLab Sciences"
                  className={fieldClass}
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="applyLink" className={labelClass}>
                  Apply Link
                </label>
                <input
                  id="applyLink"
                  type="url"
                  value={form.applyLink}
                  onChange={update("applyLink")}
                  placeholder="https://www.applyhere.com"
                  className={fieldClass}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={update("location")}
                  placeholder="e.g. Brussels, Belgium"
                  className={fieldClass}
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label htmlFor="salary" className={labelClass}>
                  Salary Range
                </label>
                <input
                  id="salary"
                  type="text"
                  value={form.salary}
                  onChange={update("salary")}
                  placeholder="e.g. €35,000 – €45,000"
                  className={fieldClass}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="employmentType" className={labelClass}>
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  value={form.employmentType}
                  onChange={update("employmentType")}
                  className={fieldClass}
                  disabled={saving}
                >
                  {EMPLOYMENT_TYPE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="level" className={labelClass}>
                  Level
                </label>
                <select
                  id="level"
                  value={form.level}
                  onChange={update("level")}
                  className={fieldClass}
                  disabled={saving}
                >
                  {LEVEL_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Job Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={update("description")}
                rows={4}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                className={`${fieldClass} resize-y`}
                required
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="requirements" className={labelClass}>
                Requirements (one per line)
              </label>
              <textarea
                id="requirements"
                value={form.requirements}
                onChange={update("requirements")}
                rows={4}
                placeholder={"BSc in Chemistry\n3+ years QC experience\nHPLC proficiency"}
                className={`${fieldClass} resize-y`}
                required
                disabled={saving}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
            >
              {saving
                ? isEdit
                  ? "Saving…"
                  : "Publishing…"
                : isEdit
                  ? "Save changes"
                  : "Publish Job"}
            </button>
          </form>
        </Card>
      </Container>
    </main>
  );
};

export default PostJobView;
