import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createSupplierJob,
  updateSupplierJob,
  formToCreatePayload,
  jobToFormValues,
  recruitmentApi,
} from "@/features/dash/supplier/recruitment";
import { JOB_BASE, MY_JOBS_PATH } from "../constant/constants";
import { emptyJobForm, jobPayloadError } from "../utils/jobForm";

/** Create (no `jobId`) or edit a job post; returns to My Job Posts on success. */
export const useJobForm = (jobId) => {
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.supplierRecruitment.saving);

  const [form, setForm] = useState(emptyJobForm);
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
        toast.error(recruitmentApi.getApiErrorMessage(err, "Failed to load job"));
        navigate(MY_JOBS_PATH);
      });

    return () => {
      cancelled = true;
    };
  }, [isEdit, jobId, navigate]);

  const fieldChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
    toast.error(result.payload || (isEdit ? "Failed to update job" : "Failed to publish job"));
  };

  return {
    isEdit,
    form,
    loadingJob,
    saving,
    backHref: isEdit ? MY_JOBS_PATH : JOB_BASE,
    fieldChange,
    setImageUrl,
    uploadImage,
    submit,
  };
};
