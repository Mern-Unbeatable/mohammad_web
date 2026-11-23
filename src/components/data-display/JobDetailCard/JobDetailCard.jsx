import { Check, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const JobDetailCard = ({ job, applyHref, onApply, showApplyButton = true }) => (
  <>
    <Card>
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <img
            src={job.image}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-[72px] sm:w-[72px]"
          />
          <div className="min-w-0">
            <h1 className="text-[20px] font-bold leading-tight text-deep-blue sm:text-[22px]">
              {job.title}
            </h1>
            <p className="mt-1 text-[14px] font-medium text-[#475467]">{job.company}</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-[#64748B]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-light" />
              {job.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-[#E4E7EC] pb-5">
          <Badge variant="fulltime">{job.employmentType}</Badge>
          <Badge variant="post">{job.level}</Badge>
          <span className="inline-flex items-center rounded-full bg-green-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-primary">
            {job.salary}
          </span>
          <span className="text-[11px] text-[#98A2B3]">{job.postedAgo}</span>
        </div>

        <section className="mt-5">
          <h2 className="text-[16px] font-bold text-deep-blue">About this role</h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[#475467]">{job.about}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-[16px] font-bold text-deep-blue">Requirements</h2>
          <ul className="mt-3 space-y-2.5">
            {job.requirements.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#475467]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>

    {showApplyButton ? (
      applyHref ? (
        <a
          href={applyHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
        >
          Apply for this Position
        </a>
      ) : (
        <button
          type="button"
          onClick={() => onApply?.(job)}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
        >
          Apply for this Position
        </button>
      )
    ) : null}
  </>
);

export default JobDetailCard;
