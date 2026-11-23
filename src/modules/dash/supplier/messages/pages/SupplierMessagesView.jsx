import PanelPage from '@/components/layout/PanelPage';
import { ChatLayout } from '@/modules/messages';

const SupplierMessagesView = () => (
  <PanelPage layout="fill">
    <ChatLayout variant="panel" />
  </PanelPage>
);

export default SupplierMessagesView;
