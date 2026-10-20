import Card from "@/components/ui/Card";

/** In-app application form with an optional cover letter. */
const ApplyForm = ({ coverLetter, onCoverLetterChange, applying, onSubmit, onCancel }) => (
  <Card className="mt-5">
    <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
      <div>
        <h2 className="text-[16px] font-bold text-deep-blue">Apply for this position</h2>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Optionally include a short cover letter with your application.
        </p>
      </div>
      <textarea
        value={coverLetter}
        onChange={(e) => onCoverLetterChange(e.target.value)}
        rows={4}
        placeholder="Cover letter (optional)"
        className="w-full resize-y rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={applying}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
        >
          {applying ? "Submitting…" : "Submit application"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] px-5 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
        >
          Cancel
        </button>
      </div>
    </form>
  </Card>
);

export default ApplyForm;
