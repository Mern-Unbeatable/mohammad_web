import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createJob,
  updateJob,
  formToCreatePayload,
  jobToFormValues,
  recruitmentApi,
} from "@/features/dash/user/recruitment";
import { MY_JOBS_PATH } from "../constant/constants";
import { emptyJobForm, jobPayloadError } from "../utils/jobForm";

/** Create (no `jobId`) or edit a job post; returns to My Job Posts on success. */
export function useJobForm(jobId) {
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.userRecruitment.saving);
  const [loadingJob, setLoadingJob] = useState(isEdit);
  const [form, setForm] = useState(emptyJobForm);

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
          toast.error(recruitmentApi.getApiErrorMessage(err, "Failed to load job"));
          navigate(MY_JOBS_PATH);
        }
      } finally {
        if (!cancelled) setLoadingJob(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, jobId, navigate]);

  const fieldChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setImageUrl = (imageUrl) => setForm((prev) => ({ ...prev, imageUrl }));

  const uploadImage = async (file) => {
    try {
      return await recruitmentApi.uploadJobImage(file);
    } catch (err) {
      throw new Error(recruitmentApi.getApiErrorMessage(err, "Logo upload failed"));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving || loadingJob) return;

    const payload = formToCreatePayload(form);
    if (isEdit && !payload.imageUrl) payload.imageUrl = null;
    const invalid = jobPayloadError(payload);
    if (invalid) {
      toast.error(invalid);
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
      navigate(MY_JOBS_PATH);
      return;
    }
    toast.error(
      result.payload || (isEdit ? "Failed to update job" : "Failed to publish job"),
    );
  };

  return {
    isEdit,
    form,
    loadingJob,
    saving,
    fieldChange,
    setImageUrl,
    uploadImage,
    submit,
  };
}
