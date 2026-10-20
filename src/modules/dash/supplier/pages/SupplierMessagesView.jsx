import PanelPage from '@/layouts/panel/PanelPage';
import ChatLayout from '@/modules/messages/route/ChatLayout';

const SupplierMessagesView = () => (
  <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
    <ChatLayout variant="panel" />
  </PanelPage>
);

export default SupplierMessagesView;
