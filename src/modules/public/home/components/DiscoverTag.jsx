/** Pill with an icon, used in "Discover More Than Connections". */
const DiscoverTag = ({ label, icon }) => {
  const Icon = icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-light/15 bg-white px-3.5 py-2 text-[12px] font-medium text-deep-blue shadow-sm shadow-pink-light/5 transition-colors hover:border-pink-light/30 xl:px-4 xl:py-2.5 xl:text-[13px]">
      <Icon className="h-3.5 w-3.5 text-pink-light xl:h-4 xl:w-4" strokeWidth={2.25} />
      {label}
    </span>
  );
};

export default DiscoverTag;
