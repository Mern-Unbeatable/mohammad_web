import { useParams } from "react-router";
import PanelPage from "@/components/layout/PanelPage";
import BackLink from "@/components/layout/BackLink";
import JobFormLoading from "../components/form/JobFormLoading";
import JobFormCard from "../components/form/JobFormCard";
import { useJobForm } from "../hooks/useJobForm";
import { MY_JOBS_PATH } from "../constant/constants";

const SupplierPostJobView = () => {
  const { jobId } = useParams();
  const jobForm = useJobForm(jobId);

  return (
    <PanelPage width="small">
      <BackLink to={MY_JOBS_PATH}>Back to my jobs</BackLink>

      {jobForm.loadingJob ? (
        <JobFormLoading />
      ) : (
        <JobFormCard
          isEdit={jobForm.isEdit}
          form={jobForm.form}
          saving={jobForm.saving}
          cancelHref={MY_JOBS_PATH}
          onFieldChange={jobForm.fieldChange}
          onSubmit={jobForm.submit}
          onImageChange={jobForm.setImageUrl}
          onUploadImage={jobForm.uploadImage}
        />
      )}
    </PanelPage>
  );
};

export default SupplierPostJobView;
