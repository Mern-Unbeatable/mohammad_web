import { useMemo } from 'react';
import Container from '@/components/ui/Container';
import LegalHeader from './LegalHeader';
import LegalToc from './LegalToc';
import LegalArticle from './LegalArticle';
import LegalFooterLinks from './LegalFooterLinks';
import { useActiveSection } from '../hooks/useActiveSection';

/** Shared legal page frame: header, sticky table of contents, numbered sections, footer links. */
const LegalDocument = ({ title, intro, sections, related }) => {
  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections]);
  const [activeId, setActiveId] = useActiveSection(sectionIds);

  return (
    <section className="bg-[#F7F8FA] py-10 lg:py-14 xl:py-16">
      <Container>
        <div className="mx-auto max-w-7xl">
          <LegalHeader title={title} intro={intro} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-8">
            <LegalToc title={title} sections={sections} activeId={activeId} onSelect={setActiveId} />

            <div className="min-w-0 space-y-6">
              <LegalArticle sections={sections} activeId={activeId} />
              <LegalFooterLinks related={related} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LegalDocument;
