import { useMemo } from "react";
import Container from "@/components/ui/Container";
import LegalHero from "./LegalHero";
import LegalToc from "./LegalToc";
import LegalArticle from "./LegalArticle";
import LegalFooterLinks from "./LegalFooterLinks";
import { useActiveSection } from "../hooks/useActiveSection";

/** Shared legal page frame: hero, sticky table of contents, numbered sections, footer links. */
const LegalDocument = ({ title, intro, badge, sections, related }) => {
  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections]);
  const [activeId, setActiveId] = useActiveSection(sectionIds);

  return (
    <div className="flex-1">
      <LegalHero badge={badge} title={title} intro={intro} />

      <section className="bg-white py-6 lg:py-8 xl:py-10">
        <Container>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-8">
              <LegalToc
                title={title}
                sections={sections}
                activeId={activeId}
                onSelect={setActiveId}
              />

              <div className="min-w-0 space-y-6">
                <LegalArticle sections={sections} activeId={activeId} />
                <LegalFooterLinks related={related} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LegalDocument;
