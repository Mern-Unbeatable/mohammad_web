import { useEffect } from 'react';
import { ExternalLink, History, MapPin, Mail, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';

const ModerationHistoryModal = ({ open, user, onClose, onOpenCase }) => {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[94dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="moderation-history-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between bg-deep-blue px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="moderation-history-title" className="text-[17px] font-bold text-white">
                  User Moderation History
                </h2>
                <StatusBadge status="Active" label="Active" className="!bg-green-secondary !text-green-primary" />
              </div>
              <p className="mt-0.5 text-[12px] text-white/70">
                Complete historical record and infractions audit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar
              src={user.avatar}
              initials={user.initials}
              alt={user.name}
              size="lg"
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] font-bold text-deep-blue">{user.name}</h3>
              <p className="mt-1 text-[13px] text-[#64748B]">
                {user.title} · {user.company}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#64748B]">
                {user.country ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.country}
                  </span>
                ) : null}
                {user.email ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </span>
                ) : null}
                {user.joinedDate ? (
                  <span>Member since {user.joinedDate}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-pink-secondary bg-pink-secondary/40 px-4 py-3 text-[13px] font-semibold text-pink-light">
            {user.totalReports} Reports in past 30 days
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Total Reports', user.totalReports, 'text-pink-light'],
              ['Official Warnings', user.warnings ?? 0, 'text-[#E67E22]'],
              ['Suspensions', 0, 'text-deep-blue'],
              ['Bans', 0, 'text-deep-blue'],
            ].map(([label, value, colorClass]) => (
              <div
                key={label}
                className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-4 text-center"
              >
                <p className={`text-[28px] font-bold leading-none ${colorClass}`}>{value}</p>
                <p className="mt-2 text-[11px] font-medium text-[#64748B]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
              Cases involving {user.name} ({user.moderationCases?.length ?? 0})
            </p>
            <div className="divide-y divide-[#E4E7EC] rounded-xl border border-[#E4E7EC]">
              {(user.moderationCases ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-primary">#{item.id}</span>
                      <span className="text-[13px] font-bold text-deep-blue">{item.category}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] italic text-[#64748B]">
                      &ldquo;{item.snippet}&rdquo;
                    </p>
                    <p className="mt-1 text-[11px] text-[#98A2B3]">{item.date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCase?.(item.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                  >
                    Open
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationHistoryModal;
