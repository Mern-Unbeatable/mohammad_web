const PanelPlaceholderView = ({ title, description }) => (
  <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white p-10 text-center">
    <h2 className="text-[22px] font-bold text-deep-blue">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-[14px] text-[#64748B]">
      {description || 'This section is scaffolded and ready for implementation.'}
    </p>
  </div>
);

export default PanelPlaceholderView;
