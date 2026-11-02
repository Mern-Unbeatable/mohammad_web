import { SECTION_BODY_CLASS } from '../constant/constants';

/** Numbered sections; each `<section id>` is a TOC anchor. The `activeId` heading is highlighted to match the TOC. */
const LegalArticle = ({ sections, activeId }) => (
  <article className="rounded-xl bg-white p-6 sm:p-8 lg:p-10">
    <div className="space-y-9">
      {sections.map(({ id, heading, content }, index) => (
        <section
          key={id}
          id={id}
          className="scroll-mt-[96px] lg:scroll-mt-[100px] xl:scroll-mt-[108px]"
        >
          <h2
            className={`text-[20px] font-bold leading-[1.3] transition-colors duration-300 sm:text-[22px] ${
              id === activeId ? 'text-primary' : 'text-deep-blue'
            }`}
          >
            {index + 1}. {heading}
          </h2>
          <div className={SECTION_BODY_CLASS}>{content}</div>
        </section>
      ))}
    </div>
  </article>
);

export default LegalArticle;
