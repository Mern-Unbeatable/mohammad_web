import { FileText } from 'lucide-react';

const downloadClass =
  'shrink-0 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]';

/** Document attached to a post, with a download action. */
const AttachmentCard = ({ attachment }) => (
  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <FileText className="h-5 w-5 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold text-deep-blue">{attachment.name}</p>
      <p className="text-[12px] text-[#64748B]">{attachment.meta}</p>
    </div>
    {attachment.url ? (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        download={attachment.name}
        className={downloadClass}
      >
        Download
      </a>
    ) : (
      <button type="button" className={downloadClass}>
        Download
      </button>
    )}
  </div>
);

export default AttachmentCard;
