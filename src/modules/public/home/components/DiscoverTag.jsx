/** Coloured pill with an icon, used in "Discover More Than Connections". */
const DiscoverTag = ({ label, icon, color, bg }) => {
  const Icon = icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium xl:px-4 xl:py-2.5 xl:text-[13px] ${bg} ${color}`}
    >
      <Icon className="h-3.5 w-3.5 xl:h-4 xl:w-4" strokeWidth={2.25} />
      {label}
    </span>
  );
};

export default DiscoverTag;
