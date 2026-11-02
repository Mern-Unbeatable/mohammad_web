const SpecTile = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
      {Icon ? (
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-primary/10"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
        <p className="mt-0.5 truncate text-[14px] font-semibold text-deep-blue">{value}</p>
      </div>
    </div>
  );
};

export default SpecTile;
