import Card from "@/components/ui/Card";
import { JobPostForm } from "@/modules/dash/user/recruitment";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/features/dash/supplier/recruitment";
import { JOB_LEVEL_OPTIONS } from "../../utils/jobForm";

/** Title block and the shared job form, worded for create or edit. */
const JobFormCard = ({
  isEdit,
  form,
  saving,
  cancelHref,
  onFieldChange,
  onSubmit,
  onImageChange,
  onUploadImage,
}) => (
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
      onFieldChange={onFieldChange}
      onSubmit={onSubmit}
      saving={saving}
      employmentOptions={EMPLOYMENT_TYPE_OPTIONS}
      levelOptions={JOB_LEVEL_OPTIONS}
      submitLabel={isEdit ? "Save changes" : "Publish Job"}
      savingLabel={isEdit ? "Saving…" : "Publishing…"}
      cancelHref={cancelHref}
      onImageChange={onImageChange}
      onUploadImage={onUploadImage}
    />
  </Card>
);

export default JobFormCard;
