const SpecTile = ({ label, value }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
    <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
    <p className="mt-1 text-[14px] font-semibold text-deep-blue">{value}</p>
  </div>
);

export default SpecTile;
