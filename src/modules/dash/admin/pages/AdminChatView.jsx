import { Outlet, useLocation, useNavigate } from 'react-router';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs';
import { CHAT_BASE_PATHS, chatPath } from '@/shared/constants/chat';

const ADMIN_CHAT_MODERATION_PATH = `${CHAT_BASE_PATHS.ADMIN}/moderation`;

const TABS = [
  { id: 'inbox', label: 'My conversations' },
  { id: 'moderation', label: 'Moderation' },
];

/** Admin chat shell: the active tab is the route (inbox sections vs `/moderation`). */
const AdminChatView = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab = pathname.startsWith(ADMIN_CHAT_MODERATION_PATH) ? 'moderation' : 'inbox';

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    navigate(tab === 'moderation' ? ADMIN_CHAT_MODERATION_PATH : chatPath(CHAT_BASE_PATHS.ADMIN));
  };

  return (
    <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
      <PanelPageHeader
        title="Chat"
        subtitle="Message members and moderate platform conversations."
        action={
          <SegmentedTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            ariaLabel="Chat sections"
          />
        }
      />
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </PanelPage>
  );
};

export default AdminChatView;
