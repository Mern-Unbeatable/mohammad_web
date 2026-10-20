import { Link, useParams } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/features/user/recruitment";
import JobPostForm from "./components/form/JobPostForm";
import { useJobForm } from "./hooks/useJobForm";
import { MY_JOBS_PATH } from "./constant/constants";
import { JOB_LEVEL_OPTIONS } from "./utils/jobForm";

const PostJobView = () => {
  const { jobId } = useParams();
  const jobForm = useJobForm(jobId);
  const { isEdit } = jobForm;

  if (jobForm.loadingJob) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container className="max-w-6xl">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <span className="text-[14px] font-medium text-[#64748B]">Loading job…</span>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-6xl">
        <Link
          to={MY_JOBS_PATH}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to my jobs
        </Link>

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
            form={jobForm.form}
            onFieldChange={jobForm.fieldChange}
            onSubmit={jobForm.submit}
            saving={jobForm.saving}
            employmentOptions={EMPLOYMENT_TYPE_OPTIONS}
            levelOptions={JOB_LEVEL_OPTIONS}
            submitLabel={isEdit ? "Save changes" : "Publish Job"}
            savingLabel={isEdit ? "Saving…" : "Publishing…"}
            cancelHref={MY_JOBS_PATH}
            onImageChange={jobForm.setImageUrl}
            onUploadImage={jobForm.uploadImage}
          />
        </Card>
      </Container>
    </main>
  );
};

export default PostJobView;
