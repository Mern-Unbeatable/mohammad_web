import Container from '@/components/ui/Container';
import NotificationsPageContent from '@/shared/pages/notifications/NotificationsPageContent';

const NotificationsView = () => (
  <main className="py-6 sm:py-8">
    <Container className="max-w-[760px]">
      <NotificationsPageContent />
    </Container>
  </main>
);

export default NotificationsView;
