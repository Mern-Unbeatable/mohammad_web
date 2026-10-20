import CategoryPill from "@/components/data-display/CategoryPill/CategoryPill";

const AdCell = ({ row }) => (
  <div>
    <p className="font-semibold text-deep-blue">{row.title}</p>
    <CategoryPill label={row.category} className="mt-1" />
  </div>
);

export default AdCell;
