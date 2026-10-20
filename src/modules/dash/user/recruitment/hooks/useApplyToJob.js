import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { applyToJob } from "@/features/dash/user/recruitment";

/** In-app apply form: open/close, cover letter and submit. */
export function useApplyToJob(jobId) {
  const dispatch = useDispatch();
  const applying = useSelector((state) => state.userRecruitment.applying);
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const close = () => {
    setOpen(false);
    setCoverLetter("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (applying) return;
    const result = await dispatch(
      applyToJob({ jobId, coverLetter: coverLetter.trim() || undefined }),
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
    applying,
    submit,
  };
}
