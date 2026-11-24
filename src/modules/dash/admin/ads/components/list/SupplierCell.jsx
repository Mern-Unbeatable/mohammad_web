import Avatar from "@/components/ui/Avatar";

/** Supplier who owns the advertisement. */
const SupplierCell = ({ row }) => (
  <div className="flex items-center gap-2.5">
    <Avatar
      src={row.supplierAvatar}
      alt={row.supplierName}
      initials={row.supplierInitials}
      size="sm"
      className="!h-8 !w-8 shrink-0"
    />
    <div className="min-w-0">
      <p className="truncate text-[13px] font-semibold text-deep-blue">{row.supplierName}</p>
      {row.supplierCompany && row.supplierCompany !== row.supplierName ? (
        <p className="mt-0.5 truncate text-[12px] text-[#64748B]">{row.supplierCompany}</p>
      ) : null}
    </div>
  </div>
);

export default SupplierCell;
