const ListingsMessage = ({ title, children }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
    <p className="text-[15px] font-semibold text-deep-blue">{title}</p>
    {children}
  </div>
);

export default ListingsMessage;
