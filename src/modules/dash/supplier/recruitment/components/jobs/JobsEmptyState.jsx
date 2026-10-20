const JobsEmptyState = ({ title, description, dashed = false }) => (
  <div
    className={`rounded-xl border bg-white px-6 py-14 text-center ${
      dashed ? "border-dashed border-[#D0D5DD]" : "border-[#E4E7EC]"
    }`}
  >
    <p className="text-[15px] font-semibold text-deep-blue">{title}</p>
    <p className="mt-2 text-[14px] text-[#64748B]">{description}</p>
  </div>
);

export default JobsEmptyState;
