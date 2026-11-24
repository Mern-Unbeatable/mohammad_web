const ReasonBanner = ({ reason, detail }) => (
  <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4">
    <p className="text-[12px] font-bold uppercase tracking-wide text-[#EA580C]">
      Report reason: {reason}
    </p>
    <p className="mt-2 text-[14px] leading-relaxed text-[#9A3412]">&ldquo;{detail}&rdquo;</p>
  </div>
);

export default ReasonBanner;
