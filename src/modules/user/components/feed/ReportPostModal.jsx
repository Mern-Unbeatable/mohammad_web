import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { reportReasons } from "@/modules/user/data/dashboard";
import { createReport } from "@/features/user/reports";

const REASON_TO_API = {
  Harassment: "HARASSMENT",
  "Fraud or scam": "FRAUD_OR_SCAM",
  Spam: "SPAM",
  Misinformation: "MISINFORMATION",
  "Hateful speech": "HATEFUL_SPEECH",
  "Threats or violence": "THREATS_OR_VIOLENCE",
  "Self-harm": "SELF_HARM",
  "Dangerous or extremist organizations": "EXTREMIST_ORGANIZATIONS",
  "Graphic content": "GRAPHIC_CONTENT",
  "Sexual content": "SEXUAL_CONTENT",
  "Fake account": "FAKE_ACCOUNT",
  "Child exploitation": "CHILD_EXPLOITATION",
  "Restricted goods and services": "RESTRICTED_GOODS",
  "Nonconsensual intimate imagery": "NONCONSENSUAL_IMAGERY",
};

const resolveTargetType = (post) => {
  if (post?.targetType) return post.targetType;
  if (post?.reportTargetType) return post.reportTargetType;
  if (post?.kind === "user" || post?.entityType === "user") return "USER";
  if (post?.type === "document" || post?.type === "news") return "GENERAL_POST";
  return "POST";
};

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const ReportPostModal = ({ open, post, onClose }) => {
  const dispatch = useDispatch();
  const { submitting } = useSelector((state) => state.userReports);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setReason("");
    setDetails("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reasonApi = REASON_TO_API[reason];
    if (!reasonApi) {
      toast.error("Please select a valid reason");
      return;
    }

    const payload = {
      targetType: resolveTargetType(post),
      reason: reasonApi,
    };
    if (isUuid(post?.id) && payload.targetType !== "USER")
      payload.targetId = post.id;
    if (isUuid(post?.author?.id)) payload.reportedUserId = post.author.id;
    else if (isUuid(post?.userId)) payload.reportedUserId = post.userId;
    const snippet =
      post?.content || post?.body || post?.text || post?.targetSnippet || "";
    if (snippet) payload.targetSnippet = String(snippet).slice(0, 1000);
    if (details.trim()) payload.reasonDetail = details.trim();

    const result = await dispatch(createReport(payload));
    if (createReport.fulfilled.match(result)) {
      toast.success("Report submitted");
      handleClose();
      return;
    }
    toast.error(result.payload || "Failed to submit report");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 sm:items-start sm:overflow-y-auto sm:p-4 sm:pt-[8vh]"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2
            id="report-post-title"
            className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
          >
            Report this post
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {post && (
              <p className="mb-4 text-[13px] text-[#64748B]">
                Reporting post by{" "}
                <span className="font-semibold text-deep-blue">
                  {post.author?.name || post.name || "member"}
                </span>
              </p>
            )}

            <p className="mb-3 text-[14px] font-semibold text-deep-blue">
              Select your reporting reason
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {reportReasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors sm:text-[12px] ${
                    reason === item
                      ? "border-primary bg-secondary text-primary"
                      : "border-[#E4E7EC] text-[#475467] hover:border-primary/40"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Write something why you report this post"
              className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:px-4 sm:py-3"
            />
          </div>

          <div className="flex shrink-0 justify-end border-t border-[#E4E7EC] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-4 sm:pb-4">
            <button
              type="submit"
              disabled={!reason || submitting}
              className="w-full rounded-md bg-primary py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPostModal;
