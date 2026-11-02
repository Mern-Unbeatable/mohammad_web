export const SectionTitle = ({ icon: Icon, children }) => (
  <h3 className="flex items-center gap-2 px-4 py-3 border-b border-[#E4E7EC] text-[15px] font-bold text-deep-blue">
    {Icon ? (
      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    ) : null}
    {children}
  </h3>
);

export const EmptyRow = ({ message }) => (
  <p className="px-4 py-6 text-center text-[12px] text-[#64748B]">{message}</p>
);
