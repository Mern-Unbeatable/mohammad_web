import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card";
import { JobPostForm } from "@/modules/user/pages/recruitment";
import { DEFAULT_WORKPLACE_TYPE } from "@/shared/constants/jobWorkplace";
import {
  createSupplierJob,
  updateSupplierJob,
  formToCreatePayload,
  jobToFormValues,
  EMPLOYMENT_TYPE_OPTIONS,
  RECRUITMENT_LEVEL_OPTIONS,
  recruitmentApi,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";

const LEVEL_OPTIONS = RECRUITMENT_LEVEL_OPTIONS.filter(
  (item) => item !== "All",
);
const MY_JOBS_PATH = "/supplier/recruitment/my-jobs";

const emptyForm = () => ({
  title: "",
  company: "",
  applyLink: "",
  location: "",
  salary: "",
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  workplaceType: DEFAULT_WORKPLACE_TYPE,
  level: LEVEL_OPTIONS[1] || LEVEL_OPTIONS[0],
  description: "",
  requirements: "",
  imageUrl: "",
});

const SupplierPostJobView = () => {
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.supplierRecruitment);

  const [form, setForm] = useState(emptyForm);
  const [loadedJobId, setLoadedJobId] = useState(null);
  const loadingJob = isEdit && loadedJobId !== jobId;

  useEffect(() => {
    if (!isEdit) return undefined;
    let cancelled = false;

    recruitmentApi
      .getJobById(jobId)
      .then((job) => {
        if (cancelled) return;
        setForm(jobToFormValues(job));
        setLoadedJobId(jobId);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          recruitmentApi.getApiErrorMessage(err, "Failed to load job"),
        );
        navigate(MY_JOBS_PATH);
      });

    return () => {
      cancelled = true;
    };
  }, [isEdit, jobId, navigate]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setImageUrl = (imageUrl) => setForm((prev) => ({ ...prev, imageUrl }));

  const uploadImage = async (file) => {
    try {
      return await recruitmentApi.uploadJobImage(file);
    } catch (err) {
      throw new Error(
        recruitmentApi.getApiErrorMessage(err, "Logo upload failed"),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || loadingJob) return;

    const payload = formToCreatePayload(form);
    if (isEdit && !payload.imageUrl) payload.imageUrl = null;
    if (
      !payload.title ||
      !payload.company ||
      !payload.location ||
      !payload.about
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!payload.requirements.length) {
      toast.error("Add at least one requirement");
      return;
    }

    const result = isEdit
      ? await dispatch(updateSupplierJob({ jobId, payload }))
      : await dispatch(createSupplierJob(payload));
    const ok = isEdit
      ? updateSupplierJob.fulfilled.match(result)
      : createSupplierJob.fulfilled.match(result);

    if (ok) {
      toast.success(isEdit ? "Job updated" : "Job published");
      navigate(MY_JOBS_PATH);
      return;
    }
    toast.error(
      result.payload ||
        (isEdit ? "Failed to update job" : "Failed to publish job"),
    );
  };

  const backHref = isEdit ? MY_JOBS_PATH : "/supplier/recruitment";

  return (
    <PanelPage width="small">
      <Link
        to={backHref}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        {isEdit ? "Back to my jobs" : "Back to Jobs"}
      </Link>

      {loadingJob ? (
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
          <span className="text-[14px] font-medium text-[#64748B]">
            Loading job…
          </span>
        </div>
      ) : (
        <Card>
          <div className="border-b border-[#EAECF0] px-5 py-5 sm:px-8 sm:py-6">
            <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
              {isEdit ? "Edit job" : "Post a Job"}
            </h1>
            <p className="mt-1 text-[14px] text-[#64748B]">
              {isEdit
                ? "Update the details of your job post."
                : "Share an opening with laboratory professionals across the network."}
            </p>
          </div>

          <JobPostForm
            form={form}
            onFieldChange={update}
            onSubmit={handleSubmit}
            saving={saving}
            employmentOptions={EMPLOYMENT_TYPE_OPTIONS}
            levelOptions={LEVEL_OPTIONS}
            submitLabel={isEdit ? "Save changes" : "Publish Job"}
            savingLabel={isEdit ? "Saving…" : "Publishing…"}
            cancelHref={backHref}
            onImageChange={setImageUrl}
            onUploadImage={uploadImage}
          />
        </Card>
      )}
    </PanelPage>
  );
};

export default SupplierPostJobView;
