import Card from "@/components/ui/Card";

/** Quote of the reported post / comment / listing. */
const ReportedTarget = ({ type, snippet }) => (
  <Card className="p-5 sm:p-6">
    <p className="text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">Reported {type}</p>
    <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">&ldquo;{snippet}&rdquo;</p>
  </Card>
);

export default ReportedTarget;
