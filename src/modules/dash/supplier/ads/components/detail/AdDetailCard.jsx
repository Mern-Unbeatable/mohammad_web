import { Calendar, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import RichText from '@/components/data-display/RichText/RichText';
import { PostActions, PostStats } from '@/modules/dash/user/feed';

const AdDetailCard = ({
  ad,
  showSocial = true,
  reactionId,
  commentsOpen,
  shared,
  onReact,
  onToggleComments,
  onShare,
}) => (
  <Card className="overflow-hidden">
    <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-secondary text-[13px] font-bold text-green-primary">
          {ad.companyInitials}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-deep-blue sm:text-[16px]">{ad.company}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B] sm:text-[13px]">
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              {ad.category}
            </span>
            <span>{ad.location}</span>
          </div>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-green-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-primary sm:text-[11px]">
        Sponsored
      </span>
    </div>

    <div className="space-y-4 px-4 py-4 sm:px-5">
      <div>
        <h1 className="text-[20px] font-bold leading-tight text-deep-blue sm:text-[22px] lg:text-[24px]">
          {ad.title}
        </h1>
        <RichText
          text={ad.description}
          className="mt-3 text-[14px] leading-relaxed text-[#475467] sm:text-[15px]"
        />
      </div>

      {ad.image ? (
        <img src={ad.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4 text-[13px] text-[#64748B] sm:text-[14px]">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Start Date: {ad.startDate}
        </span>
        <span className="font-semibold text-pink-light">Expiry Date: {ad.expiryDate}</span>
      </div>

      <p className="text-[22px] font-bold text-deep-blue sm:text-[24px]">{ad.price}</p>
    </div>

    {showSocial && ad.stats ? (
      <>
        <PostStats stats={ad.stats} reactionId={reactionId} onCommentsClick={onToggleComments} />
        <PostActions
          reactionId={reactionId}
          onReact={onReact}
          commentsOpen={commentsOpen}
          onToggleComments={onToggleComments}
          onShare={onShare}
          shared={shared}
        />
      </>
    ) : null}
  </Card>
);

export default AdDetailCard;
