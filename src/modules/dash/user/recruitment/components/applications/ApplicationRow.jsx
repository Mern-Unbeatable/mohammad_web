import { Link } from "react-router";
import { Eye, X } from "lucide-react";
import { CANCELLABLE_APPLICATION_STATUSES, jobDetailPath } from "../../constant/constants";
import { applicationStatusClass } from "../../utils/candidates";

const actionClass =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-semibold transition-colors sm:flex-none sm:py-1.5";

/** One of the caller's applications: job, status, View and Cancel. Actions drop below the details on mobile. */
const ApplicationRow = ({ app, withdrawing, onWithdraw, jobHref = jobDetailPath }) => {
  const title = app.job?.title || "Job posting";
  const canView = Boolean(app.jobId);
  const canCancel = canView && CANCELLABLE_APPLICATION_STATUSES.has(app.status);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E4E7EC] bg-white p-3 sm:flex-row sm:items-center sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {app.job?.image ? (
          <img
            src={app.job.image}
            alt=""
            className="h-14 w-14 shrink-0 rounded-lg border border-[#E4E7EC] bg-white object-contain p-1 sm:h-16 sm:w-16"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          {canView ? (
            <Link
              to={jobHref(app.jobId)}
              className="line-clamp-2 text-[15px] font-semibold leading-snug text-deep-blue hover:text-primary hover:underline sm:line-clamp-1"
            >
              {title}
            </Link>
          ) : (
            <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-deep-blue sm:line-clamp-1">
              {title}
            </p>
          )}
          <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
            {[app.job?.company, app.job?.location].filter(Boolean).join(" · ") || "—"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={applicationStatusClass(app.status)}>{app.status}</span>
            <span className="text-[11px] text-[#98A2B3]">{app.appliedAt}</span>
          </div>
        </div>
      </div>

      {canView || canCancel ? (
        <div className="flex gap-2 border-t border-[#F2F4F7] pt-3 sm:shrink-0 sm:border-0 sm:pt-0">
          {canView ? (
            <Link
              to={jobHref(app.jobId)}
              aria-label={`View ${title}`}
              className={`${actionClass} border-primary/30 text-primary hover:bg-[#E8F3FB]`}
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          ) : null}
          {canCancel ? (
            <button
              type="button"
              onClick={() => onWithdraw(app)}
              disabled={withdrawing}
              aria-label={`Cancel application for ${title}`}
              className={`${actionClass} border-[#FDA29B] text-[#D92D20] hover:bg-[#FEF3F2] disabled:opacity-60`}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationRow;
