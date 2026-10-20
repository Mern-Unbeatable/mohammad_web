import { useEffect } from "react";
import { Link } from "react-router";
import { Mail, MapPin, Phone, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { applicationStatusClass } from "../../utils/candidates";

const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F3FB] text-primary">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-[12px] text-[#98A2B3]">{label}</p>
      <div className="text-[14px] font-medium text-deep-blue [overflow-wrap:anywhere]">
        {children}
      </div>
    </div>
  </div>
);

/** Applicant profile + cover letter for a job owner. */
const ApplicantDetailsModal = ({ application, onClose }) => {
  const open = Boolean(application);

  useEffect(() => {
    if (!open) return undefined;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const { applicant = {}, name, status, appliedLabel, profileHref } = application;
  const headline = [applicant.title, applicant.company].filter(Boolean).join(" · ");
  const location = applicant.location || applicant.country;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[480px] flex-col rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 className="text-[17px] font-bold text-deep-blue sm:text-[18px]">
            Applicant details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <div className="flex items-center gap-4">
            <Avatar src={applicant.avatar} alt={name} size="lg" />
            <div className="min-w-0 flex-1">
              <p
                id="applicant-modal-title"
                className="text-[17px] font-bold text-deep-blue [overflow-wrap:anywhere]"
              >
                {name}
              </p>
              {headline ? (
                <p className="mt-0.5 text-[13px] text-[#64748B] [overflow-wrap:anywhere]">
                  {headline}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={applicationStatusClass(status)}>
                  {status}
                </span>
                <span className="text-[12px] text-[#98A2B3]">{appliedLabel}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#E4E7EC] pt-5">
            {applicant.email ? (
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email">
                <a href={`mailto:${applicant.email}`} className="hover:text-primary hover:underline">
                  {applicant.email}
                </a>
              </InfoRow>
            ) : null}
            {applicant.phone ? (
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone">
                <a href={`tel:${applicant.phone}`} className="hover:text-primary hover:underline">
                  {applicant.phone}
                </a>
              </InfoRow>
            ) : null}
            {location ? (
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location">
                {location}
              </InfoRow>
            ) : null}
          </div>

          <section className="mt-5 border-t border-[#E4E7EC] pt-5">
            <h3 className="text-[14px] font-bold text-deep-blue">Cover letter</h3>
            {application.coverLetter ? (
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#F9FAFB] px-3.5 py-3 text-[13px] leading-relaxed text-[#475467] [overflow-wrap:anywhere]">
                {application.coverLetter}
              </p>
            ) : (
              <p className="mt-2 text-[13px] text-[#98A2B3]">
                No cover letter was included.
              </p>
            )}
          </section>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#E4E7EC] px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB]"
          >
            Close
          </button>
          {profileHref ? (
            <Link
              to={profileHref}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#066BB0]"
            >
              View full profile
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
