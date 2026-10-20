import { Link } from "react-router";
import { Eye, X } from "lucide-react";
import { CANCELLABLE_APPLICATION_STATUSES, jobDetailPath } from "../../constant/constants";
import { applicationStatusClass } from "../../utils/candidates";

/** One of the caller's applications: job, status, View and Cancel. */
const ApplicationRow = ({ app, withdrawing, onWithdraw, jobHref = jobDetailPath }) => {
  const title = app.job?.title || "Job posting";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
      {app.job?.image ? (
        <img
          src={app.job.image}
          alt=""
          className="w-16 shrink-0 self-stretch rounded-lg border border-[#E4E7EC] bg-white object-contain p-1"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        {app.jobId ? (
          <Link
            to={jobHref(app.jobId)}
            className="block truncate text-[15px] font-semibold text-deep-blue hover:text-primary hover:underline"
          >
            {title}
          </Link>
        ) : (
          <p className="truncate text-[15px] font-semibold text-deep-blue">{title}</p>
        )}
        <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
          {[app.job?.company, app.job?.location].filter(Boolean).join(" · ") || "—"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={applicationStatusClass(app.status)}>{app.status}</span>
          <span className="text-[11px] text-[#98A2B3]">{app.appliedAt}</span>
        </div>
      </div>
      {app.jobId ? (
        <Link
          to={jobHref(app.jobId)}
          aria-label={`View ${app.job?.title || "job posting"}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      ) : null}
      {app.jobId && CANCELLABLE_APPLICATION_STATUSES.has(app.status) ? (
        <button
          type="button"
          onClick={() => onWithdraw(app)}
          disabled={withdrawing}
          aria-label={`Cancel application for ${app.job?.title || "job posting"}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#FDA29B] px-3 py-1.5 text-[12px] font-semibold text-[#D92D20] transition-colors hover:bg-[#FEF3F2] disabled:opacity-60"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      ) : null}
    </div>
  );
};

export default ApplicationRow;
