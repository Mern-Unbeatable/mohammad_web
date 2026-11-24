import RichText from "@/components/data-display/RichText/RichText";

/** Title, description, media and price — the ad content preview. */
const AdBody = ({ ad }) => (
  <div className="space-y-4 px-5 py-5 sm:px-6">
    <div>
      <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[24px]">
        {ad.title}
      </h1>
      <RichText text={ad.description} className="mt-3 text-[14px] leading-relaxed text-[#475467]" />
    </div>

    {ad.image ? (
      <img src={ad.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
    ) : null}

    <p className="text-[24px] font-bold text-deep-blue">{ad.price}</p>
  </div>
);

export default AdBody;
