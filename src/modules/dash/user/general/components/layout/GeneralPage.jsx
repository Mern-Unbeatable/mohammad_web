import Container from '@/components/ui/Container';

const GeneralPage = ({ containerClassName, children }) => (
  <main className="pt-6 pb-8 sm:pt-8">
    <Container className={containerClassName}>{children}</Container>
  </main>
);

export default GeneralPage;
