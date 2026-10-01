import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import ChatLayout from '@/shared/layout/ChatLayout/ChatLayout';

const SupplierMessagesView = () => (
  <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
    <ChatLayout variant="panel" />
  </PanelPage>
);

export default SupplierMessagesView;
