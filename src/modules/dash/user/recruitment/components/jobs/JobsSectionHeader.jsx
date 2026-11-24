/** Title row for the "Public Job Posts" / "My Job Posts" / "My Applications" sections. */
const JobsSectionHeader = ({
  title,
  description,
  count,
  itemName = "job post",
  children,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h2 className="flex items-baseline gap-1.5 text-[20px] font-bold text-deep-blue">
        {title}
        {typeof count === "number" ? (
          <span
            className=" font-semibold text-pink-light"
            aria-label={`${count} ${itemName}${count === 1 ? "" : "s"}`}
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
