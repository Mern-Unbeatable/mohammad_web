import Container from '@/components/ui/Container';

/** Page frame; `overlays` (modals) render outside the container. */
const MarketplacePage = ({
  className = 'pt-6 pb-5 sm:pt-8 sm:pb-8',
  containerClassName,
  overlays = null,
  children,
}) => (
  <main className={className}>
    <Container className={containerClassName}>{children}</Container>
    {overlays}
  </main>
);

export default MarketplacePage;
