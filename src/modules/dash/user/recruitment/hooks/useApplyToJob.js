import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { applyToJob } from "@/features/dash/user/recruitment";
import { validateCvFile } from "@/features/recruitment/cvFile";

/** In-app apply form: open/close, cover letter, required CV and submit. */
export function useApplyToJob(jobId) {
  const dispatch = useDispatch();
  const applying = useSelector((state) => state.userRecruitment.applying);
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState(null);

  const close = () => {
    setOpen(false);
    setCoverLetter("");
    setCvFile(null);
    setCvError(null);
  };

  const selectCv = (file) => {
    const error = validateCvFile(file);
    setCvError(error);
    setCvFile(error ? null : file);
    if (error) toast.error(error);
  };

  const removeCv = () => {
    setCvFile(null);
    setCvError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (applying) return;
    const error = validateCvFile(cvFile);
    if (error) {
      setCvError(error);
      toast.error(error);
      return;
    }
    const result = await dispatch(
      applyToJob({ jobId, coverLetter: coverLetter.trim() || undefined, cv: cvFile }),
    );
    if (applyToJob.fulfilled.match(result)) {
      toast.success("Application submitted");
      close();
      return;
    }
    toast.error(result.payload || "Failed to apply to job");
  };

  return {
    open,
    openForm: () => setOpen(true),
    close,
    coverLetter,
    setCoverLetter,
    cvFile,
    selectCv,
    removeCv,
    cvError,
    applying,
    submit,
  };
}
