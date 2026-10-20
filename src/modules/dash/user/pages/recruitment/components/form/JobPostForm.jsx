import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import { WORKPLACE_TYPE_OPTIONS } from "@/features/recruitment/jobWorkplace";
import JobImageField from "./JobImageField";

const fieldClass =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] hover:border-[#98A2B3] focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-[#F9FAFB]";

const FormSection = ({ title, description, children }) => (
  <section className="grid gap-5 px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
    <div>
      <h2 className="text-[15px] font-bold text-deep-blue">{title}</h2>
      {description ? (
        <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">
          {description}
        </p>
      ) : null}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

const Field = ({
  id,
  label,
  required = false,
  optional = false,
  hint,
  children,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-deep-blue"
    >
      {label}
      {required ? (
        <span className="text-pink-light" aria-hidden="true">
          *
        </span>
      ) : null}
      {optional ? (
        <span className="rounded-full bg-[#F2F4F7] px-2 py-px text-[11px] font-medium text-[#64748B]">
          Optional
        </span>
      ) : null}
    </label>
    {children}
    {hint ? <p className="mt-1.5 text-[12px] text-[#64748B]">{hint}</p> : null}
  </div>
);

const SelectField = ({ id, value, onChange, options, disabled }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    className={fieldClass}
    disabled={disabled}
  >
    {options.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
);

/**
 * Shared create / edit job form. The parent owns the state and submit logic;
 * `onFieldChange(key)` must return an input change handler.
 */
const JobPostForm = ({
  form,
  onFieldChange,
  onSubmit,
  saving = false,
  employmentOptions,
  workplaceOptions = WORKPLACE_TYPE_OPTIONS,
  levelOptions,
  submitLabel,
  savingLabel,
  cancelHref,
  onImageChange,
  onUploadImage,
}) => {
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = (event) => {
    if (imageUploading) {
      event.preventDefault();
      return;
    }
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="divide-y divide-[#EAECF0]">
        <FormSection
          title="Job basics"
          description="The essentials candidates see first in the job list."
        >
          {onUploadImage ? (
            <JobImageField
              value={form.imageUrl}
              onChange={onImageChange}
              onUpload={onUploadImage}
              onUploadingChange={setImageUploading}
              disabled={saving}
            />
          ) : null}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="title" label="Job title" required>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={onFieldChange("title")}
                placeholder="e.g. Quality Control Analyst"
                className={fieldClass}
                required
                disabled={saving}
              />
            </Field>
            <Field id="company" label="Company / Laboratory" required>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={onFieldChange("company")}
                placeholder="e.g. EuroLab Sciences"
                className={fieldClass}
                required
                disabled={saving}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="location" label="Location" required>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={onFieldChange("location")}
                placeholder="e.g. Brussels, Belgium"
                className={fieldClass}
                required
                disabled={saving}
              />
            </Field>
            <Field id="employmentType" label="Employment type" required>
              <SelectField
                id="employmentType"
                value={form.employmentType}
                onChange={onFieldChange("employmentType")}
                options={employmentOptions}
                disabled={saving}
              />
            </Field>
          </div>
          <fieldset disabled={saving}>
            <legend className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-deep-blue">
              Workplace type
              <span className="text-pink-light" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#D0D5DD] bg-[#F9FAFB] p-1">
              {workplaceOptions.map((option) => {
                const checked = form.workplaceType === option;
                return (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-md px-3 py-2 text-center text-[13px] font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/30 ${
                      checked
                        ? "bg-white text-primary shadow-sm"
                        : "text-[#64748B] hover:text-deep-blue"
                    }`}
                  >
                    <input
                      type="radio"
                      name="workplaceType"
                      value={option}
                      checked={checked}
                      onChange={onFieldChange("workplaceType")}
                      className="sr-only"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </FormSection>

        <FormSection
          title="Compensation & level"
          description="Roles with a salary range get noticeably more interest."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="salary" label="Salary range" optional>
              <input
                id="salary"
                type="text"
                value={form.salary}
                onChange={onFieldChange("salary")}
                placeholder="e.g. €35,000 – €45,000"
                className={fieldClass}
                disabled={saving}
              />
            </Field>
            <Field id="level" label="Experience level" required>
              <SelectField
                id="level"
                value={form.level}
                onChange={onFieldChange("level")}
                options={levelOptions}
                disabled={saving}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Job details"
          description="Explain the role and what a strong candidate brings."
        >
          <Field
            id="description"
            label="Job description"
            required
            hint="Cover responsibilities, team, and what makes the role exciting. Line breaks, lists (- item) and **bold** are kept."
          >
            <textarea
              id="description"
              value={form.description}
              onChange={onFieldChange("description")}
              rows={7}
              className={`${fieldClass} resize-y leading-relaxed`}
              required
              disabled={saving}
            />
          </Field>
          <Field
            id="requirements"
            label="Requirements"
            required
            hint="Add one requirement per line."
          >
            <textarea
              id="requirements"
              value={form.requirements}
              onChange={onFieldChange("requirements")}
              rows={5}
              placeholder={
                "e.g.\nBSc in Chemistry\n3+ years QC experience\nHPLC proficiency"
              }
              className={`${fieldClass} resize-y leading-relaxed`}
              required
              disabled={saving}
            />
          </Field>
        </FormSection>

        <FormSection
          title="How to apply"
          description="Applications come through Lab Unity unless you add an external link."
        >
          <Field
            id="applyLink"
            label="External apply link"
            optional
            hint="Leave empty to receive applications directly on Lab Unity."
          >
            <input
              id="applyLink"
              type="url"
              value={form.applyLink}
              onChange={onFieldChange("applyLink")}
              placeholder="e.g. https://careers.example.com/qc-analyst"
              className={fieldClass}
              disabled={saving}
            />
          </Field>
        </FormSection>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-b-xl border-t border-[#EAECF0] bg-[#F9FAFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
        {cancelHref ? (
          <Link
            to={cancelHref}
            className="inline-flex items-center justify-center rounded-lg border border-[#D0D5DD] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#344054] hover:bg-[#F2F4F7]"
          >
            Cancel
          </Link>
        ) : null}
        <button
          type="submit"
          disabled={saving || imageUploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#066BB0] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? savingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
