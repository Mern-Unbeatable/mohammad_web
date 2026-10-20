import Container from '@/components/ui/Container';
import NotificationsPanel from '../components/list/NotificationsPanel';

const NotificationsView = () => (
  <main className="py-6 sm:py-8">
    <Container className="max-w-[760px]">
      <NotificationsPanel />
    </Container>
  </main>
);

export default NotificationsView;
