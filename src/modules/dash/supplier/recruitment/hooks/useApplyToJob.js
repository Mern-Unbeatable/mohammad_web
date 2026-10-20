import { useState } from "react";
import { toast } from "react-hot-toast";
import { recruitmentApi } from "@/features/dash/supplier/recruitment";

/** In-app apply form: open/close, cover letter, submit and "just applied" per job. */
export const useApplyToJob = (jobId) => {
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedJobId, setAppliedJobId] = useState(null);

  const close = () => {
    setOpen(false);
    setCoverLetter("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (applying) return;

    setApplying(true);
    try {
      await recruitmentApi.applyToJob(jobId, { coverLetter: coverLetter.trim() || undefined });
      toast.success("Application submitted");
      setAppliedJobId(jobId);
      close();
    } catch (err) {
      toast.error(recruitmentApi.getApiErrorMessage(err, "Failed to apply to job"));
    } finally {
      setApplying(false);
    }
  };

  return {
    open,
    openForm: () => setOpen(true),
    close,
    coverLetter,
    setCoverLetter,
    applying,
    submit,
    justApplied: Boolean(jobId) && appliedJobId === jobId,
  };
};
