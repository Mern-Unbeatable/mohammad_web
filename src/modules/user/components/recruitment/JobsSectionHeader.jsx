/** Title row for the "Public Job Posts" / "My Job Posts" sections. */
const JobsSectionHeader = ({ title, description, count, children }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h2 className="flex items-baseline gap-1.5 text-[20px] font-bold text-deep-blue">
        {title}
        {typeof count === "number" ? (
          <span
            className="text-[15px] font-semibold text-pink-light"
            aria-label={`${count} job ${count === 1 ? "post" : "posts"}`}
          >
            ({count})
          </span>
        ) : null}
      </h2>
      <p className="mt-1 text-[14px] text-[#64748B]">{description}</p>
    </div>
    {children}
  </div>
);

export default JobsSectionHeader;
