/** Title row for the "Public Job Posts" / "My Job Posts" sections. */
const JobsSectionHeader = ({ title, description, countLabel, children }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h2 className="text-[20px] font-bold text-deep-blue">{title}</h2>
      <p className="mt-1 text-[14px] text-[#64748B]">{description}</p>
      {countLabel ? (
        <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
          {countLabel}
        </p>
      ) : null}
    </div>
    {children}
  </div>
);

export default JobsSectionHeader;
