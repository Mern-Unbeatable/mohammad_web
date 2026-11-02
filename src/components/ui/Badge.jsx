const variants = {
  question: "bg-[#FEF3E8] text-[#E67E22]",
  information: "bg-green-secondary text-green-primary",
  sponsored: "border border-green-primary/30 bg-white text-green-primary",
  post: "bg-[#F3F4F6] text-[#64748B]",
  fulltime: "bg-secondary text-primary",
  workplace: "bg-[#F4F3FF] text-[#5925DC]",
  promo: "bg-[#FDF0F6] text-pink-light",
};

const Badge = ({ children, variant = "post", className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide sm:text-[10px] ${variants[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
