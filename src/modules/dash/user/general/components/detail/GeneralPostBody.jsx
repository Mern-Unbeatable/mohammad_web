const paragraphClass = 'text-[14px] leading-[1.75] text-[#475467] sm:text-[15px] lg:text-[16px]';

/** Body paragraphs, or the summary when there is no body. */
const GeneralPostBody = ({ body, summary }) => (
  <div className="mt-6 space-y-4">
    {body.length ? (
      body.map((paragraph) => (
        <p key={paragraph} className={paragraphClass}>
          {paragraph}
        </p>
      ))
    ) : summary ? (
      <p className={paragraphClass}>{summary}</p>
    ) : null}
  </div>
);

export default GeneralPostBody;
