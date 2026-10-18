import { Link } from 'react-router';
import { Loader2, Lock, LockOpen, Pencil, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { JOB_STATUS, JOB_STATUS_LABEL } from '@/shared/constants/jobStatus';

const STATUS_BADGE_CLASS = {
  [JOB_STATUS.OPEN]: 'bg-green-secondary text-green-primary',
  [JOB_STATUS.CLOSED]: 'bg-[#F3F4F6] text-[#475467]',
  [JOB_STATUS.REMOVED]: 'bg-pink-secondary text-pink-light',
};

const JobCard = ({
  job,
  variant = 'browse',
  highlighted = false,
  detailHref,
  onDelete,
  onEdit,
  onToggleStatus,
  togglingStatus = false,
}) => {
  const href = detailHref || `/recruitment/${job.id}`;
  const status = job.status || JOB_STATUS.OPEN;
  const canToggleStatus =
    variant === 'mine' && onToggleStatus && status !== JOB_STATUS.REMOVED;
  const showImage = variant === 'browse' && Boolean(job.image);

  return (
  <Card className={`p-4 sm:p-5 ${highlighted ? 'border-[#E67E22]' : ''}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        {showImage ? (
          <img
            src={job.image}
            alt=""
            className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-snug text-deep-blue sm:text-[16px] lg:text-[17px]">
            {job.title}
          </h3>
          <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px] lg:text-[15px]">
            {job.company} · {job.location}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {variant === 'mine' ? (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${STATUS_BADGE_CLASS[status] || STATUS_BADGE_CLASS[JOB_STATUS.CLOSED]}`}
              >
                {JOB_STATUS_LABEL[status] || status}
              </span>
            ) : null}
            <Badge variant="fulltime">{job.employmentType}</Badge>
            <Badge variant="post">{job.level}</Badge>
            <span className="inline-flex items-center rounded-full bg-green-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-primary sm:text-[11px] lg:text-[12px]">
              {job.salary}
            </span>
            <span className="text-[11px] text-[#98A2B3] sm:text-[12px] lg:text-[13px]">{job.postedAgo}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {variant === 'admin' ? (
          <>
            <button
              type="button"
              onClick={() => onDelete?.(job.id)}
              className="inline-flex items-center justify-center rounded-md bg-pink-light px-3.5 py-2 text-[12px] font-semibold text-white hover:opacity-90"
            >
              Delete
            </button>
            <Link
              to={href}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
            >
              View Details
            </Link>
          </>
        ) : variant === 'mine' ? (
          <>
            <Link
              to={href}
              className="inline-flex items-center justify-center rounded-md bg-green-primary px-3.5 py-2 text-[12px] font-semibold text-white hover:opacity-90"
            >
              View Details
            </Link>
            {canToggleStatus ? (
              <button
                type="button"
                onClick={() => onToggleStatus(job)}
                disabled={togglingStatus}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
              >
                {togglingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : status === JOB_STATUS.OPEN ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <LockOpen className="h-3.5 w-3.5" />
                )}
                {status === JOB_STATUS.OPEN ? 'Close' : 'Reopen'}
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Edit job"
              onClick={() => onEdit?.(job.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#FEF3E8] text-[#E67E22] hover:bg-[#FDEBD6]"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Delete job"
              onClick={() => onDelete?.(job.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-pink-secondary text-pink-light hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          <Link
            to={href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0]"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  </Card>
  );
};

export default JobCard;
