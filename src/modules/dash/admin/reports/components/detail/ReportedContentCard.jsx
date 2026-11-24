import { ExternalLink } from "lucide-react";
import { Link } from "react-router";
import Avatar from "@/components/ui/Avatar";

/** Live preview of the reported post / listing / job / user. */
const ReportedContentCard = ({ target, fallbackType, fallbackSnippet }) => {
  const typeLabel = target?.type || fallbackType || "Content";
  const body = target?.body || fallbackSnippet || "";
  const title = target?.title || `Reported ${typeLabel}`;
  const missing = target && !target.exists;

  return (
    <div className="px-5 py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
          Reported {typeLabel}
        </p>
        {target?.href ? (
          <Link
            to={target.href}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline"
          >
            Open full item
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>

      {missing ? (
        <div className="rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3">
          <p className="text-[13px] font-semibold text-[#B42318]">
            {title || "Original content unavailable"}
          </p>
          {fallbackSnippet ? (
            <p className="mt-1 text-[13px] leading-relaxed text-[#912018]">
              Saved snippet: &ldquo;{fallbackSnippet}&rdquo;
            </p>
          ) : (
            <p className="mt-1 text-[13px] text-[#912018]">
              This item may have been deleted after it was reported.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
          {target?.author ? (
            <div className="mb-3 flex items-center gap-2.5">
              <Avatar
                src={target.author.avatar}
                alt={target.author.name}
                initials={target.author.initials}
                size="sm"
                className="!h-8 !w-8 shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-deep-blue">
                  {target.author.name}
                </p>
                {target.author.company ? (
                  <p className="truncate text-[12px] text-[#64748B]">{target.author.company}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {title && title !== `Reported ${typeLabel}` ? (
            <h3 className="text-[15px] font-bold text-deep-blue">{title}</h3>
          ) : null}

          {target?.meta ? (
            <p className="mt-1 text-[12px] font-medium text-[#64748B]">{target.meta}</p>
          ) : null}

          {body ? (
            <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-[#475467]">
              {body}
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-[#98A2B3]">No content body available.</p>
          )}

          {target?.imageUrl ? (
            <img
              src={target.imageUrl}
              alt=""
              className="mt-3 max-h-64 w-full rounded-lg object-cover"
            />
          ) : null}

          {target?.images?.length > 1 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {target.images.slice(0, 3).map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="aspect-square w-full rounded-md object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ReportedContentCard;
