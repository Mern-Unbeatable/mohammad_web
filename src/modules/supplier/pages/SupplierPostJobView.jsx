import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card";
import JobPostForm from "@/modules/user/components/recruitment/JobPostForm";
import { DEFAULT_WORKPLACE_TYPE } from "@/shared/constants/jobWorkplace";
import {
  createSupplierJob,
  formToCreatePayload,
  EMPLOYMENT_TYPE_OPTIONS,
  RECRUITMENT_LEVEL_OPTIONS,
  recruitmentApi,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";

const LEVEL_OPTIONS = RECRUITMENT_LEVEL_OPTIONS.filter((item) => item !== "All");

const SupplierPostJobView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.supplierRecruitment);

  const [form, setForm] = useState({
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

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setImageUrl = (imageUrl) =>
    setForm((prev) => ({ ...prev, imageUrl }));

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
    if (saving) return;

    const payload = formToCreatePayload(form);
    if (!payload.title || !payload.company || !payload.location || !payload.about) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!payload.requirements.length) {
      toast.error("Add at least one requirement");
      return;
    }

    const result = await dispatch(createSupplierJob(payload));
    if (createSupplierJob.fulfilled.match(result)) {
      toast.success("Job published");
      navigate("/supplier/recruitment/my-jobs");
      return;
    }
    toast.error(result.payload || "Failed to publish job");
  };

  return (
    <PanelPage width="narrow">
      <Link
        to="/supplier/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <Card>
        <div className="border-b border-[#EAECF0] px-5 py-5 sm:px-8 sm:py-6">
          <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
            Post a Job
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Share an opening with laboratory professionals across the network.
          </p>
        </div>

        <JobPostForm
          form={form}
          onFieldChange={update}
          onSubmit={handleSubmit}
          saving={saving}
          employmentOptions={EMPLOYMENT_TYPE_OPTIONS}
          levelOptions={LEVEL_OPTIONS}
          submitLabel="Publish Job"
          savingLabel="Publishing…"
          cancelHref="/supplier/recruitment"
          onImageChange={setImageUrl}
          onUploadImage={uploadImage}
        />
      </Card>
    </PanelPage>
  );
};

export default SupplierPostJobView;
