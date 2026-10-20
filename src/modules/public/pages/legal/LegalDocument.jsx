import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import { SUPPORT_CONTACT } from "@/shared/constants/support";
import { LEGAL_LAST_UPDATED } from "@/modules/public/pages/legal/constant/constants";

const sectionBodyClass =
  "mt-3 space-y-3 text-[15px] leading-[1.75] text-[#475467] [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-deep-blue [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5";

const useActiveSection = (ids) => {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-24px 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids]);

  return [activeId, setActiveId];
};

const LegalDocument = ({ title, intro, sections, related }) => {
  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections]);
  const [activeId, setActiveId] = useActiveSection(sectionIds);

  return (
    <section className="bg-[#F7F8FA] py-10 lg:py-14 xl:py-16">
      <Container>
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 lg:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary xl:text-[12px]">
              Legal
            </p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-deep-blue sm:text-[36px] xl:text-[42px]">
              {title}
            </h1>
            <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#64748B] xl:text-[16px]">
              {intro}
            </p>
            <p className="mt-4 text-[13px] text-[#64748B]">
              Last updated: {LEGAL_LAST_UPDATED}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-8">
            <nav
              aria-label={`${title} sections`}
              className="rounded-xl bg-white p-4 sm:p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto"
            >
              <div className="flex items-center justify-between px-3 pb-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-deep-blue">
                  On this page
                </p>
                <span className="text-[12px] text-[#98A2B3]">
                  {sections.length} sections
                </span>
              </div>
              <ol className="grid grid-cols-1 gap-1 border-t border-[#F0F2F5] pt-3 sm:grid-cols-2 lg:grid-cols-1">
                {sections.map(({ id, heading }, index) => {
                  const isActive = id === activeId;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => setActiveId(id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-[15px] leading-[1.45] transition-colors ${
                          isActive
                            ? "bg-secondary font-medium text-primary"
                            : "text-[#475467] hover:bg-[#F7F8FA] hover:text-deep-blue"
                        }`}
                      >
                        <span
                          className={`min-w-[1.5rem] shrink-0 tabular-nums ${
                            isActive ? "text-primary" : "text-[#98A2B3]"
                          }`}
                        >
                          {index + 1}.
                        </span>
                        <span>{heading}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="min-w-0 space-y-6">
              <article className="rounded-xl bg-white p-6 sm:p-8 lg:p-10">
                <div className="space-y-9">
                  {sections.map(({ id, heading, content }, index) => (
                    <section key={id} id={id} className="scroll-mt-6">
                      <h2 className="text-[20px] font-bold leading-[1.3] text-deep-blue sm:text-[22px]">
                        {index + 1}. {heading}
                      </h2>
                      <div className={sectionBodyClass}>{content}</div>
                    </section>
                  ))}
                </div>
              </article>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to={related.to}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-white p-5 transition-colors hover:bg-secondary"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B]">
                      Also read
                    </p>
                    <p className="mt-0.5 text-[15px] font-semibold text-deep-blue">
                      {related.label}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`mailto:${SUPPORT_CONTACT.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-5 transition-colors hover:bg-secondary"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B]">
                      Questions?
                    </p>
                    <p className="mt-0.5 break-all text-[15px] font-semibold text-deep-blue">
                      {SUPPORT_CONTACT.email}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LegalDocument;
